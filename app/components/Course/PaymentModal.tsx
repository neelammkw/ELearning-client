"use client";
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useCreatePaymentIntentMutation } from "@/redux/features/orders/ordersApi";

const PaymentModal = ({
  open,
  onClose,
  stripePromise,
  course,
  router,
}: {
  open: boolean;
  onClose: () => void;
  stripePromise: any;
  course: any;
  router: any;
}) => {
  const [createPaymentIntent, { data: paymentIntentData, isLoading }] =
    useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (open && course?._id && !clientSecret) {
      createPaymentIntent({ courseId: course._id })
        .unwrap()
        .then((response) => {
          setClientSecret(response.clientSecret);
          setOrderId(response.orderId);
        })
        .catch((err) => {
          console.error("Failed to create Payment Please Login to Access", err);
          onClose();
        });
    }
  }, [open, course?._id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-100 mt-10">
      <div className="bg-gray-200  rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Complete Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>

        {isLoading ? (
          <p className="text-center">Loading payment form...</p>
        ) : clientSecret && stripePromise ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              onClose={onClose}
              onSuccess={() => router.push(`/course-access/${course._id}`)}
              course={course}
              clientSecret={clientSecret}
              orderId={orderId}
            />
          </Elements>
        ) : (
          <p className="text-center">Unable to load payment form</p>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
