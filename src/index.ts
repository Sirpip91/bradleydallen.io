import { createAdaptorServer, serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config";
import Stripe from 'stripe';
import { error } from 'console';
import { HTTPException } from 'hono/http-exception';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });


const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello World!')
});

app.post('/', (c) => {
  return c.text('This is a post request!')
});

app.post('/checkout', async (c) => {

    try{
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:[
          {
            price: 'price_1PN2guFRcXq5egITHtAIiRnm',
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
      return c.json(session);
      
    }catch(error: any){
        console.error(error);
        throw new HTTPException(500, {message: error?.message});
    }

});

app.get('/success', (c) => {
  return c.text('Success!')
})
app.get('/cancel', (c) => {
  return c.text('Canceled!')
})




const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
