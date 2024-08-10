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
        //we get here
        console.log(session);
        const userId = session.metadata?.user_id;


        if (!userId) {
          console.error('User ID is missing in session metadata');
          return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
      }

        // Update the stripe_customer_id for the given user_id
        const { error } = await supabaseAdmin
        .from('stripe_customers')
        .upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            has_paid:session.payment_status,
            customer_name: session.customer_details?.name,
        })
        .select()

        if (error) {
          console.error(`Error updating stripe_customer_id: ${error.message}`);
          return NextResponse.json({ message: `Database Error: ${error.message}` }, { status: 500 });
      }

      console.log('Stripe customer ID updated successfully for user:', userId);
 

      }
  
      if (event.type === 'customer.subscription.updated') {

      }
  
      if (event.type === 'customer.subscription.deleted') {

      }
  
      return NextResponse.json({ message: 'success' });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }