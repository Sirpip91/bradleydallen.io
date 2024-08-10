import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    try {
        const { priceId, email, userId } = await request.json();

        console.log('Creating Checkout Session with the following details:');
        console.log('Price ID:', priceId);
        console.log('Email:', email);
        console.log('User ID:', userId);

        const session = await stripe.checkout.sessions.create({
            metadata: {
                user_id: userId,
            },
            customer_creation: 'always',
            customer_email: email,
            payment_method_types: ['card'],
            line_items: [
                {
                    // one-time setup fee
                    price: 'price_1PN2guFRcXq5egITHtAIiRnm',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/success`,
            cancel_url: `${request.headers.get('origin')}/pro`,
        });

        console.log('Checkout Session Created:', JSON.stringify(session, null, 2));

        return NextResponse.json({ id: session.id });
    } catch (error: any) {
        console.error('Error creating Checkout Session:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
