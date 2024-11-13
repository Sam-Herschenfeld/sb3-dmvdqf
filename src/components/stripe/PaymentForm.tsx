import React, { useState } from 'react';
import { CardElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeProvider } from './StripeProvider';
import { setupPaymentMethod } from '../../api/stripe';
import type { PaymentFormProps } from '../../types/stripe';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      lineHeight: '24px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

const ADDRESS_ELEMENT_OPTIONS = {
  mode: 'billing' as const,
  fields: {
    phone: 'always',
  },
  validation: {
    phone: {
      required: 'always',
    },
  },
};

function CheckoutForm({ description }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    if (!email) {
      setError('Please provide your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const addressElement = elements.getElement(AddressElement);
      const { error: addressError } = await elements.submit();
      if (addressError) {
        throw new Error(addressError.message);
      }

      const { clientSecret } = await setupPaymentMethod({
        description,
        email,
        address: addressElement?.getValue().address,
      });

      const { error: setupError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
            address: addressElement?.getValue().address,
          },
        },
      });

      if (setupError) {
        throw new Error(setupError.message);
      }

      setSuccess(true);
      console.log('Setup successful:', setupIntent?.payment_method);
    } catch (err) {
      console.error('Setup error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
        <p className="font-medium">Payment method saved successfully!</p>
        <p className="text-sm mt-2">Your card has been securely stored for future payments.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="min-h-[40px] p-3 border border-gray-300 rounded-md bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Address
          </label>
          <AddressElement options={ADDRESS_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? 'Processing...' : 'Save Payment Method'}
      </button>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <StripeProvider>
      <CheckoutForm {...props} />
    </StripeProvider>
  );
}