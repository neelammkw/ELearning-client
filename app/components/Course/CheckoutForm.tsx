"use client";
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useConfirmOrderMutation } from "@/redux/features/orders/ordersApi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { userAgent } from "next/server";

const CheckoutForm = ({
  onClose,
  onSuccess,
  course,
  clientSecret,
  orderId,
}: {
  onClose: () => void;
  onSuccess: () => void;
  course: any;
  clientSecret: string;
  orderId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [confirmOrder] = useConfirmOrderMutation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery({ skip: loadUser ? false : true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Payment system is not ready. Please try again later.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
          receipt_email: email,
        },
        redirect: "if_required",
      });

      if (error) {
        throw error;
      }

      if (paymentIntent?.status === "succeeded") {
        await confirmOrder({
          paymentIntentId: paymentIntent.id,
          courseId: course._id,
          orderId: orderId,
        }).unwrap();

        setMessage("Payment successful! Redirecting to course...");
        setPaymentSuccess(true);
        setLoadUser(true);
        setTimeout(() => {
          onSuccess();
          router.push(`/course-access/${course._id}`);
        }, 2000);
      } else {
        setMessage(`Payment status: ${paymentIntent?.status}`);
      }
    } catch (err: any) {
      setMessage(err.message || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-150">
      {paymentSuccess ? (
        <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 p-4 rounded-lg mb-4">
          <h3 className="font-bold">Payment Successful!</h3>
          <p>You now have full access to the course. Redirecting you now...</p>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 dark:text-gray-300"
            >
              Email Receipt
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              placeholder="your@email.com"
            />
          </div>

          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />

          {message && (
            <div
              className={`p-2 rounded text-sm ${
                message.includes("success") || message.includes("succeeded")
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="w-full mt-4 bg-gray-800"
          >
            {isLoading ? "Processing..." : `Pay $${course.price}`}
          </Button>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <p>
              💳 Test card:{" "}
              <span className="font-mono">4242 4242 4242 4242</span>
            </p>
            <p>Use any future expiry date, 3-digit CVC, and random ZIP code</p>
          </div>
        </>
      )}
    </form>
  );
};

export default CheckoutForm;
