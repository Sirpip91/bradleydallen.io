'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseServer';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('stripe-signature');
        let event;
        try {
            event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (error: any) {
            console.error(`Webhook signature verification failed: ${error.message}`);
            return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const session: Stripe.Checkout.Session = event.data.object;

            const userId = session.metadata?.user_id;
            const buyMode = session.metadata?.buyMode;
            const product_name = session.metadata?.product_name; 

            if (!userId) {
                console.error('User ID is missing in session metadata');
                return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
            }

            if (buyMode === 'subscription') {
                const { error } = await supabaseAdmin
                    .from('stripe_customers')
                    .upsert({
                        user_id: userId, 
                        stripe_customer_id: session.customer, 
                        subscription_id: session.subscription, 
                        pro_active: true, 
                        plan_expires: null, 
                        customer_name: session.customer_details?.name,
                    })
                    .select()

                if (error) {
                    console.error(`Error updating stripe_customer_id: ${error.message}`);
                    return NextResponse.json({ message: `Database Error: ${error.message}` }, { status: 500 });
                }

            } else if (buyMode === 'payment') {
                if (session.amount_total !== null) {
                    const productPrice = session.amount_total / 100; // Convert to dollars
                    const timestamp = Date.now(); // Use actual timestamp

                    const { data: existingPayment, error: fetchError } = await supabaseAdmin
                        .from('one_time_payments')
                        .select('purchased_products, purchase_dates, prices')
                        .eq('user_id', session.metadata?.user_id)
                        .maybeSingle();

                    if (fetchError) {
                        console.error('Error fetching existing payment:', fetchError);
                    }

                    if (!existingPayment) {
                        const { error: createError } = await supabaseAdmin
                            .from('one_time_payments')
                            .insert({
                                user_id: session.metadata?.user_id,
                                purchased_products: [session.metadata?.product_name],
                                purchase_dates: [timestamp],
                                prices: [productPrice],
                                stripe_customer_id: session.customer
                            });

                        if (createError) {
                            console.error(`Error creating one_time_payments row: ${createError.message}`);
                            return NextResponse.json({ message: `Database Error: ${createError.message}` }, { status: 500 });
                        }
                        console.log('One-time payment created successfully for user:', session.metadata?.user_id);
                    } else {
                        const updatedPurchasedProducts = [...(existingPayment.purchased_products || []), session.metadata?.product_name];
                        const updatedPurchaseDates = [...(existingPayment.purchase_dates || []), timestamp];
                        const updatedPrices = [...(existingPayment.prices || []), productPrice];

                        const { error } = await supabaseAdmin
                            .from('one_time_payments')
                            .upsert({
                                user_id: session.metadata?.user_id,
                                purchased_products: updatedPurchasedProducts, 
                                purchase_dates: updatedPurchaseDates,
                                prices: updatedPrices,
                                stripe_customer_id: session.customer
                            }, { onConflict: 'user_id' });

                        if (error) {
                            console.error(`Error updating one_time_payments: ${error.message}`);
                            return NextResponse.json({ message: `Database Error: ${error.message}` }, { status: 500 });
                        }
                        console.log('One-time payment added successfully for user:', session.metadata?.user_id);
                    }
                } else {
                    console.error('session.amount_total is null');
                }
            }
        }

        if (event.type === 'customer.subscription.updated') {
            const subscription: Stripe.Subscription = event.data.object;
            const { error } = await supabaseAdmin
                .from('stripe_customers')
                .update({ plan_expires: subscription.cancel_at })
                .eq('subscription_id', subscription.id);
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const { error } = await supabaseAdmin
                .from('stripe_customers')
                .update({ pro_active: false, subscription_id: null })
                .eq('subscription_id', subscription.id);
        }

        return NextResponse.json({ message: 'success' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
