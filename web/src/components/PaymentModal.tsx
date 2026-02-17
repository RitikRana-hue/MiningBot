"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, Landmark, ArrowRight, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { PaymentMethod, NETBANKING_BANKS, PlanType, CardDetails, UPIDetails, NetBankingDetails } from "@/types/payment";
import { usePayment } from "@/context/PaymentContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: PlanType;
  planName: string;
  amount: number;
  onSuccess: (orderId: string) => void;
}

export default function PaymentModal({ isOpen, onClose, planType, planName, amount, onSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const { initPayment } = usePayment();

  const validateCard = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateUPI = (id: string) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(id);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/\d{1,4}/g);
    return matches ? matches.join(" ") : "";
  };

  const handlePayment = async () => {
    setError(null);
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    if (selectedMethod === "UPI") {
      if (!upiId.trim() || !validateUPI(upiId)) {
        setError("Please enter a valid UPI ID");
        return;
      }
    } else if (selectedMethod === "CARD") {
      if (!cardName.trim() || !validateCard(cardNumber) || !expiryMonth || !expiryYear || cvv.length < 3) {
        setError("Please fill all card details correctly");
        return;
      }
    } else if (selectedMethod === "NETBANKING" && !selectedBank) {
      setError("Please select a bank");
      return;
    }

    setIsLoading(true);
    try {
      let paymentMethodData;
      if (selectedMethod === "UPI") {
        paymentMethodData = { upiId } as UPIDetails;
      } else if (selectedMethod === "CARD") {
        paymentMethodData = { cardholderName: cardName, cardNumber: cardNumber.replace(/\s/g, ""), expiryMonth, expiryYear, cvv } as CardDetails;
      } else {
        const bank = NETBANKING_BANKS.find((b) => b.code === selectedBank);
        paymentMethodData = { bankCode: selectedBank, bankName: bank?.name || "" } as NetBankingDetails;
      }

      const result = await initPayment(planType, planName, amount, selectedMethod, paymentMethodData);
      if (result.success && result.orderId) {
        setOrderId(result.orderId);
        setSuccess(true);
        setTimeout(() => {
          onSuccess(result.orderId!);
          handleClose();
        }, 2000);
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod(null);
    setError(null);
    setSuccess(false);
    setOrderId(null);
    setUpiId("");
    setCardName("");
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setSelectedBank("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-zinc-900 rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <button onClick={handleClose} className="text-zinc-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6">
              {success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-zinc-400">Order: {orderId}</p>
                </motion.div>
              )}
              {error && !success && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              {!success && (
                <>
                  <div className="bg-zinc-800 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-400">{planName} Plan</span>
                      <span className="font-semibold">₹{amount.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-zinc-700 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-emerald-400">₹{amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {!selectedMethod ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium mb-4">Select Payment Method</p>
                      <button onClick={() => setSelectedMethod("UPI")} className="w-full p-4 border-2 border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors flex items-center gap-3">
                        <Smartphone className="h-6 w-6 text-emerald-500" />
                        <div className="text-left">
                          <p className="font-semibold">UPI</p>
                          <p className="text-xs text-zinc-500">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </button>
                      <button onClick={() => setSelectedMethod("CARD")} className="w-full p-4 border-2 border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                        <div className="text-left">
                          <p className="font-semibold">Card</p>
                          <p className="text-xs text-zinc-500">Visa, Mastercard, RuPay</p>
                        </div>
                      </button>
                      <button onClick={() => setSelectedMethod("NETBANKING")} className="w-full p-4 border-2 border-zinc-700 rounded-xl hover:border-emerald-500 transition-colors flex items-center gap-3">
                        <Landmark className="h-6 w-6 text-amber-500" />
                        <div className="text-left">
                          <p className="font-semibold">Net Banking</p>
                          <p className="text-xs text-zinc-500">All major banks</p>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setSelectedMethod(null)} className="text-emerald-400 text-sm mb-4">← Back</button>
                      {selectedMethod === "UPI" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">UPI ID</label>
                          <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="username@bank" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-emerald-500" />
                        </div>
                      )}
                      {selectedMethod === "CARD" && (
                        <div className="space-y-4">
                          <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Cardholder Name" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" />
                          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" />
                          <div className="grid grid-cols-3 gap-4">
                            <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white">
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => <option key={i} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>)}
                            </select>
                            <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white">
                              <option value="">YY</option>
                              {Array.from({ length: 10 }, (_, i) => <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>{String(new Date().getFullYear() + i).slice(-2)}</option>)}
                            </select>
                            <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} placeholder="CVV" maxLength={4} className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" />
                          </div>
                        </div>
                      )}
                      {selectedMethod === "NETBANKING" && (
                        <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white">
                          <option value="">Choose bank...</option>
                          {NETBANKING_BANKS.map((bank) => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
                        </select>
                      )}
                    </>
                  )}
                  {selectedMethod && (
                    <button onClick={handlePayment} disabled={isLoading} className="w-full mt-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                      {isLoading ? <><Loader className="h-5 w-5 animate-spin" />Processing...</> : <>Pay ₹{amount.toLocaleString()}<ArrowRight className="h-5 w-5" /></>}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
