import React from 'react';
import { CreditCard, Clock, Shield } from 'lucide-react';
import type { Feature } from '../types';

const features: Feature[] = [
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Your payment information is encrypted and stored securely'
  },
  {
    icon: Clock,
    title: 'Quick Setup',
    description: 'One-time payment setup for hassle-free future sessions'
  },
  {
    icon: Shield,
    title: 'Protected Data',
    description: 'Bank-level security standards to protect your information'
  }
];

export function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <feature.icon className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}