import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useUserAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ application }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const price = application.expectedSalary;

  // 1. Ask Backend for a "Payment Intent" (Permission to charge)
  useEffect(() => {
    if (price > 0) {
      const token = localStorage.getItem("access-token");
      fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ price }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [price]);

  // 2. Handle Form Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);

    // A. Create Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    // B. Confirm Payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email || "unknown@example.com",
          },
        },
      }
    );

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    // C. Payment Success! Save to Database
    if (paymentIntent.status === "succeeded") {
      const token = localStorage.getItem("access-token");
      
      const paymentData = {
        email: user.email,
        transactionId: paymentIntent.id,
        price: price,
        date: new Date(),
        applicationId: application._id,
        tuitionId: application.tuitionId,
        tutorName: application.tutorName,
        status: "service_pending"
      };

      const res = await fetch("http://localhost:5000/payments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();
      
      if (data.paymentResult.insertedId) {
        Swal.fire("Success!", "Payment successful. Tutor hired!", "success");
        navigate("/dashboard/applied-tutors");
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Pay Salary: ৳{price}</h3>
      
      <div className="border p-4 rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      <button
        className="btn btn-primary w-full mt-6 text-white"
        type="submit"
        disabled={!stripe || !clientSecret || processing}
      >
        {processing ? "Processing..." : `Pay ৳${price}`}
      </button>
    </form>
  );
};

export default CheckoutForm;