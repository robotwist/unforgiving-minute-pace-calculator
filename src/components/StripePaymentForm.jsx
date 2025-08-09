import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ 
  selectedPlan, 
  onSuccess, 
  onError, 
  loading, 
  userProfile,
  colors 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState('');

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: colors.black,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: colors.silver,
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Clear previous errors
    setPaymentError('');

    try {
      // Create payment intent with backend
      const apiUrl = process.env.REACT_APP_API_URL || 'https://unforgiving-moment-production.up.railway.app/api';
      
      const response = await fetch(`${apiUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price * 100, // Convert to cents
          planName: selectedPlan.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: userProfile?.name || 'Anonymous',
            email: userProfile?.email || '',
          },
        }
      });

      if (result.error) {
        setPaymentError(result.error.message);
        onError(result.error);
      } else {
        // Payment succeeded
        onSuccess(result);
      }

    } catch (error) {
      setPaymentError(error.message || 'An error occurred processing your payment.');
      onError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <label className="block font-medium" style={{ color: colors.black }}>
          Payment Information
        </label>
        
        <div 
          className="p-4 border-2 rounded-lg transition-colors focus-within:border-blue-500"
          style={{ borderColor: colors.gray }}
        >
          <CardElement options={cardElementOptions} />
        </div>

        {paymentError && (
          <div 
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            {paymentError}
          </div>
        )}
      </div>

      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: colors.lightBlue + '20' }}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: colors.black }}>Plan:</span>
            <span style={{ color: colors.black, fontWeight: '600' }}>{selectedPlan.name}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: colors.black }}>Price:</span>
            <span style={{ color: colors.black, fontWeight: '600' }}>
              ${selectedPlan.price}
              {selectedPlan.id === 'personal-coaching' && '/month'}
            </span>
          </div>
          <div className="border-t pt-2 mt-2" style={{ borderColor: colors.gray }}>
            <div className="flex justify-between font-bold">
              <span style={{ color: colors.black }}>Total:</span>
              <span style={{ color: colors.black }}>
                ${selectedPlan.price}
                {selectedPlan.id === 'personal-coaching' && '/month'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full munich-btn munich-btn-primary"
          style={{ 
            opacity: (!stripe || loading) ? 0.6 : 1,
            cursor: (!stripe || loading) ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${selectedPlan.price}${selectedPlan.id === 'personal-coaching' ? '/month' : ''}`
          )}
        </button>

        <div className="text-xs text-center space-y-1" style={{ color: colors.silver }}>
          <p>🔒 Secure payment processing powered by Stripe</p>
          <p>💳 All major credit cards accepted</p>
          <p>🛡️ Your payment information is encrypted and secure</p>
        </div>
      </div>
    </form>
  );
};

export default StripePaymentForm;
