import React from 'react';
import { CheckCircle } from 'lucide-react';
import { PaymentForm } from './stripe/PaymentForm';
import type { PricingTier } from '../types';

export function PricingCard({ title, price, period, features, popular, description }: PricingTier) {
  return (
    <div className={`relative bg-white p-8 rounded-lg shadow-md ${
      popular ? 'border-2 border-indigo-600 transform scale-105' : ''
    }`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg">
          Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-6">
        ${price}<span className="text-lg text-gray-600">/{period}</span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <PaymentForm amount={price} description={description} />
    </div>
  );
}