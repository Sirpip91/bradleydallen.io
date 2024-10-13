'use server';

import { stripe } from '@/lib/stripe';

export async function createPortalSession(customerId: string) {
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `http://bradleydallen.io/user`,
      });
  
      return { id: portalSession.id, url: portalSession.url };
}