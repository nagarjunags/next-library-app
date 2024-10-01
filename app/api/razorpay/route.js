import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

// Initialize Razorpay instance with your test key
const instance = new Razorpay({
  key_id: "rzp_test_V8RbPCpR6oZ2Db",
  key_secret: "wHt8UgTsSVsG5PnVDz7J5yo5",
});

export async function GET(req) {
  // Extract query parameters
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Ensure the userId is passed
  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Razorpay options for creating an order
  const payment_capture = 1;
  const amount = 10 * 100; // amount in paisa (₹10.00)
  const currency = "INR";

  const options = {
    amount: amount.toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
    notes: {
      paymentFor: "testingDemo",
      userId: userId, // dynamically set the userId from query param
      productId: 'P100'
    },
  };

  try {
    // Create an order in Razorpay
    const order = await instance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    // Return the order details in response
    return NextResponse.json({ msg: "success", order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function POST(req) {
  // Handle POST requests
  const body = await req.json();
  return NextResponse.json({ msg: body });
}
