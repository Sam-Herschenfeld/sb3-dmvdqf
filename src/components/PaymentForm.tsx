import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  amount: number;
  description: string;
}

interface PaymentError {
  message: string;
  code?: string;
}

function CheckoutForm({ amount, description }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      });

      if (paymentError) {
        setError({
          message: paymentError.message || 'Payment failed',
          code: paymentError.code
        });
      }
    } catch (err) {
      setError({
        message: 'An unexpected error occurred',
        code: 'unknown_error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700">Total: ${amount}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <PaymentElement />
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error.message}
          {error.code && <span className="block text-xs mt-1">Error code: {error.code}</span>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

interface PaymentFormProps {
  amount: number;
  description: string;
}

export function PaymentForm({ amount, description }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Missing Stripe publishable key');
        }

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, description }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent');
        }

        if (!data.clientSecret) {
          throw new Error('No client secret received');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
        console.error('Payment initialization error:', err);
      }
    };

    fetchPaymentIntent();
  }, [amount, description]);

  const options: StripeElementsOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#4F46E5',
      },
    },
  } : {};

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return clientSecret ? (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} description={description} />
    </Elements>
  ) : (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-40 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}