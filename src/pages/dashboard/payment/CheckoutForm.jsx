import React, { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useUserAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, Loader2 } from "lucide-react";

const CheckoutForm = ({ application }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const price = application.expectedSalary;

  useEffect(() => {
    if (price > 0) {
      const token = localStorage.getItem("access-token");
      fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ price }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setError("Failed to initialize payment");
          }
        })
        .catch((err) => {
          console.error("Payment intent error:", err);
          setError("Failed to connect to payment server");
        });
    }
  }, [price]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);
    setError("");

    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      setError(methodError.message);
      setProcessing(false);
      return;
    }

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

    if (paymentIntent.status === "succeeded") {
      try {
        const token = localStorage.getItem("access-token");
        const paymentData = {
          email: user.email,
          transactionId: paymentIntent.id,
          price: price,
          date: new Date(),
          applicationId: application._id,
          tuitionId: application.tuitionId,
          tutorName: application.tutorName,
          tutorEmail: application.tutorEmail,
          status: "service_pending"
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(paymentData)
        });

        const data = await res.json();
        
        if (data.paymentResult?.insertedId) {
          Swal.fire({
            title: "Payment Successful!",
            text: `You've successfully hired ${application.tutorName}`,
            icon: "success",
            confirmButtonColor: "#10b981"
          });
          navigate("/dashboard/applied-tutors");
        } else {
          throw new Error("Failed to save payment record");
        }
      } catch (err) {
        console.error("Save payment error:", err);
        Swal.fire({
          title: "Payment Received",
          text: "Payment was successful but there was an issue saving the record. Please contact support.",
          icon: "warning"
        });
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Payment Details</h3>
        <p className="text-gray-500 mt-2">First month's salary</p>
        <div className="text-3xl font-bold text-primary mt-3">₹{price.toLocaleString()}</div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
        <p className="text-sm text-gray-600 mb-1">Hiring Tutor</p>
        <p className="font-bold text-gray-800">{application.tutorName}</p>
        <p className="text-xs text-gray-500 mt-1">{application.tuitionData?.subject}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border-2 border-gray-200 p-4 rounded-xl bg-white hover:border-primary transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: '"Inter", sans-serif',
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { 
                  color: "#ef4444",
                  iconColor: "#ef4444"
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm text-center">{error}</p>
        </div>
      )}

      <button
        className="btn btn-primary w-full text-white h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        type="submit"
        disabled={!stripe || !clientSecret || processing}
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock size={18} />
            Pay ₹{price.toLocaleString()}
          </span>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <Lock size={12} />
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
};

export default CheckoutForm;
