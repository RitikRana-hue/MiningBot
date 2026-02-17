"use client";

import { X, User, Crown, Zap, Shield, Check, CreditCard, Mail, Calendar } from "lucide-react";
import { useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  plan: "free" | "pro" | "enterprise";
  subscriptionStatus: "active" | "trial" | "expired";
  messagesUsed: number;
  messagesLimit: number;
  features: string[];
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "January 15, 2024",
  plan: "pro",
  subscriptionStatus: "active",
  messagesUsed: 847,
  messagesLimit: 5000,
  features: [
    "Advanced mining analysis",
    "Unlimited file uploads",
    "Priority support",
    "Custom reports",
    "API access"
  ]
};

const plans = [
  {
    name: "Free",
    price: "$0",
    icon: User,
    color: "text-zinc-500",
    bgColor: "bg-zinc-100 dark:bg-zinc-800",
    borderColor: "border-zinc-300 dark:border-zinc-600",
    features: [
      "100 messages per month",
      "Basic mining info",
      "Community support",
      "Limited file uploads"
    ]
  },
  {
    name: "Pro",
    price: "$29/mo",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-500",
    features: [
      "5,000 messages per month",
      "Advanced analysis",
      "Priority support",
      "Unlimited file uploads",
      "Custom reports"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    borderColor: "border-purple-500",
    features: [
      "Unlimited messages",
      "Advanced AI models",
      "Dedicated support",
      "Custom integrations",
      "API access",
      "White-label options"
    ]
  }
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(mockProfile.plan);

  if (!isOpen) return null;

  const usagePercentage = (mockProfile.messagesUsed / mockProfile.messagesLimit) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Profile & Subscription</h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h3>
            
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {mockProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{mockProfile.name}</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{mockProfile.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Joined {mockProfile.joinDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{mockProfile.messagesUsed}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Messages Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{mockProfile.messagesLimit}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Monthly Limit</div>
                </div>
                <div className="text-center">
                  <div className={`text-sm font-semibold ${
                    mockProfile.subscriptionStatus === 'active' ? 'text-green-600' : 
                    mockProfile.subscriptionStatus === 'trial' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {mockProfile.subscriptionStatus.charAt(0).toUpperCase() + mockProfile.subscriptionStatus.slice(1)}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Status</div>
                </div>
              </div>
              
              {/* Usage Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Monthly Usage</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{mockProfile.messagesUsed} / {mockProfile.messagesLimit}</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Current Plan
            </h3>
            
            <div className={`relative rounded-xl border-2 p-6 ${
              mockProfile.plan === 'pro' ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' :
              mockProfile.plan === 'enterprise' ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10' :
              'border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800'
            }`}>
              {mockProfile.plan === 'pro' && (
                <div className="absolute -top-3 left-6 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    mockProfile.plan === 'pro' ? 'bg-blue-500' :
                    mockProfile.plan === 'enterprise' ? 'bg-purple-500' :
                    'bg-zinc-500'
                  }`}>
                    {mockProfile.plan === 'pro' ? <Zap className="h-6 w-6 text-white" /> :
                     mockProfile.plan === 'enterprise' ? <Crown className="h-6 w-6 text-white" /> :
                     <User className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 capitalize">{mockProfile.plan} Plan</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {mockProfile.plan === 'free' ? 'Perfect for getting started' :
                       mockProfile.plan === 'pro' ? 'Best for professionals' :
                       'For large organizations'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {mockProfile.plan === 'free' ? '$0' : mockProfile.plan === 'pro' ? '$29' : 'Custom'}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {mockProfile.plan !== 'enterprise' ? '/month' : 'pricing'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                {mockProfile.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Plans */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Available Plans
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedPlan === plan.name.toLowerCase() 
                      ? `${plan.borderColor} ${plan.bgColor}` 
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                  }`}
                  onClick={() => setSelectedPlan(plan.name.toLowerCase() as any)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-3 ${
                      plan.name === 'Pro' ? 'bg-blue-500' :
                      plan.name === 'Enterprise' ? 'bg-purple-500' :
                      'bg-zinc-500'
                    }`}>
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{plan.name}</h4>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{plan.price}</div>
                    {plan.name !== 'Enterprise' && (
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">/month</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-zinc-700 dark:text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlan === plan.name.toLowerCase()
                        ? 'bg-blue-500 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {mockProfile.plan === plan.name.toLowerCase() ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Close
          </button>
          {selectedPlan !== mockProfile.plan && (
            <button
              onClick={() => {
                alert(`Upgrade to ${selectedPlan} plan would be processed here`);
                onClose();
              }}
              className="px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
