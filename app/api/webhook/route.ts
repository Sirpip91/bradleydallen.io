'use server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseServer';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
    try {
      const rawBody = await request.text();
      const signature = request.headers.get('stripe-signature');
      //stripe webhook
      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature!, process.env.STRIPE_WEBHOOK_SECRET!);
      } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
      }
  
      // Handle the checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session: Stripe.Checkout.Session = event.data.object;
        
        const userId = session.metadata?.user_id;
        const buyMode = session.metadata?.buyMode;
        const product_name = session.metadata?.product_name; 
        //we get here
        console.log(session);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");


        if (!userId) {
          console.error('User ID is missing in session metadata');
          return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
        }

        //Determine if Subsciption:
        if (buyMode === 'subscription') {
        // Update the stripe_customer_id for the given user_id
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
            console.log('Stripe customer ID updated successfully for user:', userId);
        
        
        }else if  (buyMode === 'payment') {
          // Handle one-time payment
          if (session.amount_total !== null) {
            const productPrice = session.amount_total / 100; // Convert to dollars
            const timestamp = Math.floor(Date.now() / 1000); // Current timestamp
    
            console.log('Inserting payment details:', {
                user_id: session.metadata?.user_id,
                purchased_products: [session.metadata?.product_name],
                purchase_dates: [timestamp],
                prices: [productPrice],
                stripe_customer_id: session.customer,
            });

          //fetch
          // Fetch existing payment
          const { data: existingPayment, error: fetchError } = await supabaseAdmin
          .from('one_time_payments')
          .select('purchased_products, purchase_dates, prices')
          .eq('user_id', session.metadata?.user_id)
          .single();

          if (fetchError) {
          console.error('Error fetching existing payment:', fetchError);
          return;
          }

          // Step 2: Prepare updated fields
          const updatedPurchasedProducts = existingPayment?.purchased_products || [];
          updatedPurchasedProducts.push(session.metadata?.product_name);

          const updatedPurchaseDates = existingPayment?.purchase_dates || [];
          updatedPurchaseDates.push(timestamp);

          const updatedPrices = existingPayment?.prices || [];
          updatedPrices.push(productPrice);

          // Update the `one_time_payments` table
          const { error } = await supabaseAdmin
            .from('one_time_payments')
            .upsert({
              user_id: session.metadata?.user_id,
              purchased_products: updatedPurchasedProducts, 
              purchase_dates: updatedPurchaseDates,
              prices: updatedPrices,
              stripe_customer_id: session.customer
            },{onConflict: 'user_id'})
            .select();

        if (error) {
          console.error(`Error updating one_time_payments: ${error.message}`);
          return NextResponse.json({ message: `Database Error: ${error.message}` }, { status: 500 });
        }
        console.log('One-time payment added successfully for user:', session.metadata?.user_id);
        }else {
          console.error('session.amount_total is null');
      }

        }//end of 'payment'
      
      
      
      
      }//end of checkout complete
      
      

      //If we pro member subscription updated.
      if (event.type === 'customer.subscription.updated') {
        const subscription: Stripe.Subscription = event.data.object;
        console.log(subscription);
            // Update the plan_expires field in the stripe_customers table
        const { error } = await supabaseAdmin
            .from('stripe_customers')
            .update({ plan_expires: subscription.cancel_at }) //still active until cancel_at
            .eq('subscription_id', subscription.id);
      }
      
      //once the cancel_at data arrives. Stripe will send delete subscription webhook.
      //we then set no more pro in supabse.
      if (event.type === 'customer.subscription.deleted') {

        const subscription = event.data.object;
        console.log(subscription);
        
        const { error } = await supabaseAdmin
        .from('stripe_customers')
        .update({ pro_active: false, subscription_id: null, })
        .eq('subscription_id', subscription.id);
      }
  
      return NextResponse.json({ message: 'success' });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }