import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const STRIPE_OPTIONS = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4F46E5',
      colorBackground: '#ffffff',
      colorText: '#32325d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
    rules: {
      '.Input': {
        border: '1px solid #E4E4E7',
        boxShadow: 'none',
        padding: '8px 12px'
      },
      '.Input:focus': {
        border: '2px solid #4F46E5',
        boxShadow: 'none'
      }
    }
  },
  loader: 'auto' as const
};

interface StripeProviderProps {
  children: React.ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise} options={STRIPE_OPTIONS}>
      {children}
    </Elements>
  );
}