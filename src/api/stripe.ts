import type { AddressElement } from '@stripe/react-stripe-js';

interface PaymentSetupRequest {
  description: string;
  email: string;
  address?: ReturnType<AddressElement['getValue']>['address'];
}

export async function setupPaymentMethod(data: PaymentSetupRequest) {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Payment setup failed');
  }

  return response.json();
}