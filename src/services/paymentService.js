// Payment service for handling Stripe API calls
class PaymentService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://unforgiving-moment-production.up.railway.app/api';
  }

  async createPaymentIntent(planId, amount, planName) {
    try {
      const response = await fetch(`${this.baseURL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          amount: Math.round(amount * 100), // Convert to cents
          planName,
          currency: 'usd'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const response = await fetch(`${this.baseURL}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async createCustomer(email, name) {
    try {
      const response = await fetch(`${this.baseURL}/create-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Mock API endpoints for development/testing
  async mockCreatePaymentIntent(planId, amount, planName) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      clientSecret: 'mock_client_secret_' + Date.now(),
      paymentIntentId: 'pi_mock_' + Date.now()
    };
  }

  async mockCreateSubscription(customerId, priceId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      subscriptionId: 'sub_mock_' + Date.now(),
      clientSecret: 'mock_subscription_secret_' + Date.now()
    };
  }
}

export const paymentService = new PaymentService();
export default PaymentService;
