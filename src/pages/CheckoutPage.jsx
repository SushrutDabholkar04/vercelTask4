// frontend/src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ totalAmount, orderDetails }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/order-success`, // Redirects after payment
            },
        });

        // This point will only be reached if there's an immediate error when confirming the payment.
        // Otherwise, your customer will be redirected to your `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Order</h3>

            {/* Display Order Summary */}
            <div className="mb-6 border-b pb-4">
                <h4 className="text-xl font-semibold mb-2">Order Summary:</h4>
                <ul className="space-y-1 text-gray-700">
                    {orderDetails && orderDetails.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center text-lg font-bold mt-3 border-t pt-3">
                    <span>Total:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
            </div>

            {/* Stripe Payment Element */}
            <PaymentElement id="payment-element" className="mb-6" />

            <button disabled={isLoading || !stripe || !elements} id="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay Now"}
                </span>
            </button>

            {/* Show any error or success messages */}
            {message && <div id="payment-message" className="text-red-500 mt-4 text-center">{message}</div>}
        </form>
    );
};

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems, total } = location.state || {}; // Get state passed from ProductsPage

    const [clientSecret, setClientSecret] = useState("");
    const [loadingClientSecret, setLoadingClientSecret] = useState(true);
    const [errorClientSecret, setErrorClientSecret] = useState(null);

    // Redirect if no items or total are passed (e.g., direct access to /checkout)
    useEffect(() => {
        if (!selectedItems || !total || total <= 0) {
            navigate('/products', { replace: true }); // Go back to products page
        }
    }, [selectedItems, total, navigate]);

    // Fetch client secret from your backend
    useEffect(() => {
        const fetchClientSecret = async () => {
            if (!total || total <= 0) return; // Don't fetch if total is invalid

            setLoadingClientSecret(true);
            setErrorClientSecret(null);

            try {
                const response = await fetch('/api/payments/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create payment intent');
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Error fetching client secret:', error);
                setErrorClientSecret(error.message);
            } finally {
                setLoadingClientSecret(false);
            }
        };

        fetchClientSecret();
    }, [total]); // Re-fetch if total changes (though unlikely on this page)

    const appearance = {
        theme: 'stripe',
        variables: {
          colorPrimary: '#60A5FA', // blue-400
          colorBackground: '#ffffff',
          colorText: '#374151', // gray-700
          colorDanger: '#EF4444', // red-500
          fontFamily: 'system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      };

    if (loadingClientSecret) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl font-medium text-gray-700">Loading payment form...</p>
            </div>
        );
    }

    if (errorClientSecret) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl text-red-600">Error: {errorClientSecret}</p>
                <button onClick={() => navigate('/products')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md">
                {clientSecret && total > 0 && (
                    <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                        <CheckoutForm totalAmount={total} orderDetails={selectedItems} />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;