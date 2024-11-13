import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { description, email, address } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const customers = await stripe.customers.list({ email });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        address,
        description: 'Tutoring platform customer',
      });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session',
      description,
    });

    res.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      customerId: customer.id,
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({
      error: 'Payment method setup failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}