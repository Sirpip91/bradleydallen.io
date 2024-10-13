'use server';
import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import { FcGoogle } from 'react-icons/fc';

export async function POST(request: Request) {
    try {
        const { priceId, email, userId, buyMode, product_name } = await request.json();

        console.log('Creating Checkout Session with the following details:');
        console.log('Price ID:', priceId);
        console.log('Email:', email);
        console.log('User ID:', userId);
        console.log('BuyMode:', buyMode)
        console.log('product_name:', product_name)
        const session = await stripe.checkout.sessions.create({
            metadata: {
                user_id: userId,
                buyMode: buyMode,
                product_name: product_name,
            },
            customer_email: email,
            payment_method_types: ['card','cashapp'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: buyMode,
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
