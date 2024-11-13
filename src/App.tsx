import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { PaymentForm } from './components/stripe/PaymentForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      
      <section id="payment" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Save Payment Method</h2>
            <PaymentForm description="Securely save your card for future payments" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;