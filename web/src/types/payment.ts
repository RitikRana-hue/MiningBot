// Payment method types
export type PaymentMethod = "UPI" | "CARD" | "NETBANKING";

// Plan types
export type PlanType = "free" | "professional" | "enterprise";

// Payment order status
export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

// UPI Payment Details
export interface UPIDetails {
  upiId: string;
}

// Card Payment Details
export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

// Net Banking Details
export interface NetBankingDetails {
  bankCode: string;
  bankName: string;
}

// Payment Method Data (discriminated union)
export type PaymentMethodData = UPIDetails | CardDetails | NetBankingDetails;

// Payment Order
export interface PaymentOrder {
  orderId: string;
  userId: string;
  userEmail: string;
  planType: PlanType;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentMethodData: PaymentMethodData;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  razorpayOrderId?: string; // For future Razorpay integration
  razorpayPaymentId?: string; // For future Razorpay integration
  errorMessage?: string;
}

// Payment Request
export interface PaymentRequest {
  planType: PlanType;
  planName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodData: PaymentMethodData;
}

// Payment Response
export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  message: string;
  error?: string;
  razorpayOrderId?: string; // For Razorpay redirect
}

// Plan Pricing
export interface PlanPricing {
  planType: PlanType;
  planName: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  currency: string;
}

// Bank Details for Net Banking
export interface BankOption {
  code: string;
  name: string;
  category: "public" | "private";
}

// Net Banking Banks List
export const NETBANKING_BANKS: BankOption[] = [
  { code: "UTIB", name: "Axis Bank", category: "private" },
  { code: "HDFC", name: "HDFC Bank", category: "private" },
  { code: "ICIC", name: "ICICI Bank", category: "private" },
  { code: "INDB", name: "IndusInd Bank", category: "private" },
  { code: "SBIN", name: "State Bank of India", category: "public" },
  { code: "IDFB", name: "IDFC Bank", category: "private" },
  { code: "AIRP", name: "Airtel Payments Bank", category: "private" },
  { code: "AUBL", name: "AU Small Finance Bank", category: "private" },
  { code: "BARB", name: "Bank of Baroda", category: "public" },
  { code: "BKID", name: "Bank of India", category: "public" },
  { code: "CBIN", name: "Central Bank of India", category: "public" },
  { code: "CIUB", name: "City Union Bank", category: "private" },
  { code: "CITI", name: "Citibank", category: "private" },
  { code: "COBL", name: "Kotak Mahindra Bank", category: "private" },
  { code: "DCCB", name: "DBS Bank", category: "private" },
  { code: "DEUTSCHE", name: "Deutsche Bank", category: "private" },
  { code: "EZEBL", name: "EZE Wealth", category: "private" },
  { code: "FDRL", name: "Federal Bank", category: "private" },
  { code: "HSBC", name: "HSBC Bank", category: "private" },
  { code: "ICBK", name: "ICICI Bank (Corporate)", category: "private" },
  { code: "IOBA", name: "Indian Overseas Bank", category: "public" },
  { code: "JAKA", name: "Jammu & Kashmir Bank", category: "public" },
  { code: "KBL", name: "Karur Vysya Bank", category: "private" },
  { code: "NKGS", name: "NKGS Bank", category: "public" },
  { code: "ORBC", name: "Oriental Bank of Commerce", category: "public" },
  { code: "PUNB", name: "Punjab National Bank", category: "public" },
  { code: "SCBL", name: "Standard Chartered Bank", category: "private" },
  { code: "SRCB", name: "Scheduled Bank", category: "public" },
  { code: "SVCB", name: "South Indian Bank", category: "private" },
  { code: "UBIN", name: "Union Bank of India", category: "public" },
];
