"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PaymentOrder, PaymentMethod, PaymentMethodData, PaymentResponse, PlanType } from "@/types/payment";

interface PaymentContextType {
  orders: PaymentOrder[];
  isLoading: boolean;
  initPayment: (planType: PlanType, planName: string, amount: number, paymentMethod: PaymentMethod, paymentMethodData: PaymentMethodData) => Promise<PaymentResponse>;
  getOrders: (userId: string) => PaymentOrder[];
  getOrderById: (orderId: string) => PaymentOrder | undefined;
  cancelOrder: (orderId: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "minegpt-orders";

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders data", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const initPayment = async (
    planType: PlanType,
    planName: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentMethodData: PaymentMethodData
  ): Promise<PaymentResponse> => {
    setIsLoading(true);

    try {
      const authData = localStorage.getItem("minegpt-auth");
      if (!authData) {
        return {
          success: false,
          message: "User not authenticated",
          error: "Please login to make a payment",
        };
      }

      const user = JSON.parse(authData);

      const paymentRequest = {
        planType,
        planName,
        amount,
        paymentMethod,
        paymentMethodData,
      };

      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentRequest,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: "Payment processing failed",
          error: data.error || "An error occurred",
        };
      }

      if (data.order) {
        setOrders((prev) => [...prev, data.order]);
      }

      return {
        success: true,
        orderId: data.orderId,
        message: "Payment order created successfully",
        razorpayOrderId: data.razorpayOrderId,
      };
    } catch (error) {
      console.error("Payment error:", error);
      return {
        success: false,
        message: "Payment processing failed",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getOrders = (userId: string): PaymentOrder[] => {
    return orders.filter((order) => order.userId === userId);
  };

  const getOrderById = (orderId: string): PaymentOrder | undefined => {
    return orders.find((order) => order.orderId === orderId);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, status: "cancelled", updatedAt: Date.now() }
          : order
      )
    );
  };

  return (
    <PaymentContext.Provider
      value={{
        orders,
        isLoading,
        initPayment,
        getOrders,
        getOrderById,
        cancelOrder,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
