//@/components/razorpay/BuyProduct.jsx
"use client";
import React, { useEffect, useState } from "react";
import Buy from "./Buy";
import { useRouter } from 'next/navigation';
import {  useSession } from "next-auth/react";


const BuyProduct = () => {
  const router = useRouter();
  const [razorpayReady, setRazorpayReady] = useState(false);
  const { data: session } = useSession();
  console.log("-----------------",session);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setRazorpayReady(true);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const makePayment = async ({ productId = null }) => {
    if (!razorpayReady) {
      console.error("Razorpay is not ready");
      return; // Ensure Razorpay is loaded before proceeding
    }

    const key = "rzp_test_V8RbPCpR6oZ2Db";
    console.log("Razorpay Key:", key);

    try {
      // Make API call to the serverless API
      const response = await fetch(`/api/razorpay?userId=${session.user.id}`);
      if (!response.ok) {
        console.error("Failed to fetch:", response.status, response.statusText);
        return; // Handle the error appropriately
      }

      const json = await response.json();
      console.log("API response:", json);

      const { order } = json;

      if (!order) {
        console.error("Order not found in the response");
        return; // Handle the error appropriately
      }

      console.log("Order ID:", order.id);

      const options = {
        key: key,
        name: "mmantratech",
        currency: order.currency,
        amount: order.amount,
        order_id: order.id,
        description: "Understanding RazorPay Integration",
        handler: async function (response) {
          console.log("Payment response:", response);

          const verificationResponse = await fetch(`/api/paymentverify?userId=${session.user.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationResult = await verificationResponse.json();
          console.log("Verification response:", verificationResult);

          if (verificationResult?.message === "success") {
            console.log("Redirecting to payment success...");
            window.location.reload();
            // router.push("/professors?paymentid=" + response.razorpay_payment_id);
          } else {
            console.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "mmantratech",
          email: "mmantratech@gmail.com",
          contact: "000000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        alert("Payment failed. Please try again. Contact support for help.");
        console.error("Payment failed:", response);
      });
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <>
      <Buy makePayment={makePayment} />
    </>
  );
};

export default BuyProduct;
