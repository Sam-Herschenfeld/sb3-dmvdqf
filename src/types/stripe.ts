import type { Stripe, StripeElements } from '@stripe/stripe-js';

export interface StripePaymentStatus {
  success: boolean;
  error?: string;
  paymentIntentId?: string;
}

export interface PaymentFormProps {
  amount?: number;
  description: string;
}

export interface StripeContextType {
  stripe: Stripe | null;
  elements: StripeElements | null;
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
}