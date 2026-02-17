import { NextRequest, NextResponse } from "next/server";
import { PaymentOrder, OrderStatus } from "@/types/payment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, planType, planName, amount, paymentMethod, paymentMethodData } = body;

    if (!userId || !userEmail || !planType || !planName || !amount || !paymentMethod || !paymentMethodData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentOrder: PaymentOrder = {
      orderId,
      userId,
      userEmail,
      planType,
      planName,
      amount,
      currency: "INR",
      paymentMethod,
      paymentMethodData,
      status: "processing" as OrderStatus,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      orderId: paymentOrder.orderId,
      message: "Payment order created successfully",
      order: paymentOrder,
      razorpayOrderId: `rzp_${Date.now()}`,
    }, { status: 200 });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
