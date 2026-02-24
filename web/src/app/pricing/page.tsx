"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { Check, X, Zap, Rocket, Crown, ChevronDown, Shield, BarChart3, Clock, Users, MessageSquare, Star, Quote } from "lucide-react";

const plans = [
  {
    name: "Starter",
    type: "free" as const,
    price: 0,
    description: "Perfect for getting started",
    icon: <Zap className="h-6 w-6" />,
    features: [
      { name: "AI Chat Assistant", included: true },
      { name: "5 document uploads/month", included: true },
      { name: "Basic analytics", included: true },
      { name: "Email support", included: true },
      { name: "1 user", included: true },
      { name: "Real-time monitoring", included: false },
      { name: "Custom reports", included: false },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Professional",
    type: "professional" as const,
    price: 49999,
    description: "For growing operations",
    icon: <Rocket className="h-6 w-6" />,
    popular: true,
    features: [
      { name: "AI Chat Assistant", included: true },
      { name: "100 document uploads/month", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true },
      { name: "Up to 10 users", included: true },
      { name: "Real-time monitoring", included: true },
      { name: "Custom reports", included: true },
      { name: "API access", included: false },
    ],
  },
  {
    name: "Enterprise",
    type: "enterprise" as const,
    price: 0,
    description: "Full-scale solution",
    icon: <Crown className="h-6 w-6" />,
    features: [
      { name: "AI Chat Assistant", included: true },
      { name: "Unlimited uploads", included: true },
      { name: "Enterprise analytics", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Unlimited users", included: true },
      { name: "Real-time monitoring", included: true },
      { name: "Custom reports", included: true },
      { name: "Full API access", included: true },
    ],
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Operations Manager",
    company: "Coal India Ltd",
    image: "RK",
    rating: 5,
    text: "MineGPT has transformed how we monitor our operations. The AI insights have helped us increase efficiency by 35% in just 3 months."
  },
  {
    name: "Priya Sharma",
    role: "Safety Director",
    company: "Adani Mining",
    image: "PS",
    rating: 5,
    text: "The real-time safety monitoring is incredible. We've reduced incidents by 60% and team loves the intuitive interface."
  },
  {
    name: "Amit Patel",
    role: "CEO",
    company: "Vedanta Resources",
    image: "AP",
    rating: 5,
    text: "Best investment we've made. The ROI was visible within the first month. Highly recommend for any mining operation."
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any charges."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, Credit/Debit Cards (Visa, Mastercard, RuPay), and Net Banking from all major Indian banks. Enterprise customers can also pay via wire transfer."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! The Starter plan is completely free forever. For Professional plan, we offer a 14-day free trial with no credit card required."
  },
  {
    question: "How secure is my data?",
    answer: "We use enterprise-grade encryption (AES-256) and comply with international security standards. Your data is stored in secure servers in India with regular backups."
  },
  {
    question: "Do you offer training?",
    answer: "Absolutely! All paid plans include onboarding support. Professional gets video tutorials and documentation, while Enterprise receives dedicated training sessions."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. No questions asked, no cancellation fees. Your data remains accessible until end of your billing period."
  },
];

const comparisons = [
  { feature: "AI Chat Queries", starter: "100/month", professional: "5,000/month", enterprise: "Unlimited" },
  { feature: "Document Analysis", starter: "5 docs", professional: "100 docs", enterprise: "Unlimited" },
  { feature: "Team Members", starter: "1", professional: "10", enterprise: "Unlimited" },
  { feature: "Data Storage", starter: "1 GB", professional: "50 GB", enterprise: "Unlimited" },
  { feature: "API Calls", starter: "-", professional: "10K/month", enterprise: "Unlimited" },
  { feature: "Custom Reports", starter: "-", professional: "✓", enterprise: "✓ Advanced" },
  { feature: "Support Response", starter: "48 hours", professional: "24 hours", enterprise: "1 hour" },
  { feature: "Uptime SLA", starter: "99%", professional: "99.9%", enterprise: "99.99%" },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const handleBuyPlan = (planName: string, planType: "free" | "professional" | "enterprise", price: number) => {
    // Since we're chat-only, redirect to chat for all plans
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Simple, Transparent <span className="text-emerald-400">Pricing</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Choose the plan that fits your mining operation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative bg-zinc-900 border-2 rounded-3xl p-8 h-full flex flex-col ${plan.popular ? "border-emerald-500" : "border-zinc-800"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.popular ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                    }`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>

                <p className="text-zinc-500 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    {plan.type === "enterprise" ? "Custom" : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.type !== "free" && plan.type !== "enterprise" && (
                    <span className="text-zinc-500">/month</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-zinc-600 shrink-0" />
                      )}
                      <span className={feature.included ? "text-zinc-300" : "text-zinc-600"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuyPlan(plan.name, plan.type, plan.price)}
                  className={`w-full py-4 rounded-full font-semibold transition-colors ${plan.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-500"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                    }`}
                >
                  {plan.type === "enterprise" ? "Contact Sales" : "Get Started"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Detailed <span className="text-emerald-400">Comparison</span></h2>
            <p className="text-zinc-500">See what's included in each plan</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-800/50">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Starter</th>
                    <th className="text-center p-4 font-semibold text-emerald-400">Professional</th>
                    <th className="text-center p-4 font-semibold text-amber-400">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={row.feature} className={i !== comparisons.length - 1 ? "border-b border-zinc-800" : ""}>
                      <td className="p-4 text-zinc-400">{row.feature}</td>
                      <td className="p-4 text-center text-zinc-300">{row.starter}</td>
                      <td className="p-4 text-center text-emerald-400">{row.professional}</td>
                      <td className="p-4 text-center text-amber-400">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by <span className="text-emerald-400">Industry Leaders</span></h2>
            <p className="text-zinc-500">See what mining professionals say about us</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative"
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-500/20" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked <span className="text-emerald-400">Questions</span></h2>
            <p className="text-zinc-500">Everything you need to know</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-emerald-400" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-zinc-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold">Enterprise Security</h3>
              <p className="text-sm text-zinc-500">Bank-grade encryption</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="font-semibold">99.9% Uptime</h3>
              <p className="text-sm text-zinc-500">Always available</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="font-semibold">500+ Mines</h3>
              <p className="text-sm text-zinc-500">Trust our platform</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
              <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="font-semibold">35% Efficiency</h3>
              <p className="text-sm text-zinc-500">Average improvement</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 border border-emerald-800/50 rounded-3xl p-12">
            <MessageSquare className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Mining Operations?</h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join 500+ mining companies using AI to improve safety, efficiency, and profitability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => router.push("/chat")}
                className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/25"
              >
                Start Using Chat
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="px-8 py-4 border-2 border-zinc-700 text-zinc-300 font-semibold rounded-full hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
              >
                Try Demo
              </button>
            </div>
            <p className="text-sm text-zinc-500 mt-6">Free to use • No registration required • Start immediately</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
