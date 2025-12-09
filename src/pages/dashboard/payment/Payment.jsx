import React from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Replace with your actual PUBLISHABLE KEY from Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK); 

const Payment = () => {
  const location = useLocation();
  const { application } = location.state || {}; // Get passed data

  if (!application) return <div>Error: No application data found.</div>;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Complete Payment</h1>
        <p className="text-gray-500 mt-2">
            Hiring <strong>{application.tutorName}</strong> for <strong>{application.tuitionData?.subject}</strong>
        </p>
      </div>
      
      <div className="w-full">
        <Elements stripe={stripePromise}>
          <CheckoutForm application={application} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;