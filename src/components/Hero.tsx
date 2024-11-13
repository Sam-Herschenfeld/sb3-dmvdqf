import React from 'react';

export function Hero() {
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expert Tutoring at Your Fingertips
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100">
            Set up your payment method once, focus on learning always
          </p>
          <a 
            href="#payment" 
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition"
          >
            Set Up Payment
          </a>
        </div>
      </div>
    </section>
  );
}