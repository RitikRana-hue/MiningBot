"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScrollProgress,
} from "@/components/animations/ScrollAnimations";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  Users,
  Headphones,
  Globe,
  ChevronRight,
  Linkedin,
  Twitter,
  Facebook,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const contactMethods = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email Us",
    description: "Our team will respond within 24 hours",
    value: "contact@minegpt.com",
    link: "mailto:contact@minegpt.com",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Call Us",
    description: "Mon-Fri from 9am to 6pm IST",
    value: "+91 1800-XXX-XXXX",
    link: "tel:+911800XXXXXXX",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Visit Us",
    description: "Come say hello at our office",
    value: "Kolkata, West Bengal, India",
    link: "#",
    color: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Working Hours",
    description: "We're available",
    value: "Mon - Sat: 9AM - 6PM IST",
    link: "#",
    color: "bg-amber-500/10 text-amber-400",
  },
];

const offices = [
  {
    city: "Kolkata",
    type: "Headquarters",
    address: "123 Park Street, Kolkata, WB 700016",
    phone: "+91 33 XXXX XXXX",
  },
  {
    city: "Ranchi",
    type: "Regional Office",
    address: "456 Main Road, Ranchi, JH 834001",
    phone: "+91 651 XXXX XXXX",
  },
  {
    city: "Bhubaneswar",
    type: "Regional Office",
    address: "789 Industrial Area, Bhubaneswar, OD 751001",
    phone: "+91 674 XXXX XXXX",
  },
];

const faqs = [
  {
    question: "How quickly can I get started?",
    answer: "You can start using our AI assistant immediately with a free account. For enterprise solutions, our team will set up a demo within 48 hours.",
  },
  {
    question: "Do you provide on-site training?",
    answer: "Yes, we offer comprehensive on-site training for enterprise customers. Our team will visit your mining site to train your staff.",
  },
  {
    question: "Is there a minimum contract period?",
    answer: "Our Professional plan is billed monthly with no long-term commitment. Enterprise plans are typically annual but can be customized.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ScrollProgress />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <FadeInUp>
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
              Get in Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
              Let&apos;s Start a
              <span className="text-emerald-400"> Conversation</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Have questions about our AI solutions? Want to schedule a demo?
              Our team is here to help transform your mining operations.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <FadeInUp key={method.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.color} mb-4`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{method.title}</h3>
                  <p className="text-sm text-zinc-500 mb-3">{method.description}</p>
                  {method.link !== "#" ? (
                    <a href={method.link} className="text-emerald-400 hover:text-emerald-300 font-medium">
                      {method.value}
                    </a>
                  ) : (
                    <span className="text-zinc-300">{method.value}</span>
                  )}
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <FadeInLeft>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
                <p className="text-zinc-500 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-zinc-400 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
                      }}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="demo">Request a Demo</option>
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Tell us about your mining operations and how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeInLeft>

            {/* Info */}
            <FadeInRight>
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Quick Connect</h3>
                  <div className="space-y-4">
                    <Link
                      href="/chat"
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Chat with AI</div>
                          <div className="text-sm text-zinc-500">Get instant answers</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link
                      href="/pricing"
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-semibold">View Pricing</div>
                          <div className="text-sm text-zinc-500">Plans for every size</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </Link>

                    <a
                      href="tel:+911800XXXXXXX"
                      className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                          <Headphones className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <div className="font-semibold">Call Support</div>
                          <div className="text-sm text-zinc-500">Toll-free helpline</div>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </a>
                  </div>
                </div>

                {/* Offices */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">Our Offices</h3>
                  <div className="space-y-6">
                    {offices.map((office) => (
                      <div key={office.city} className="flex gap-4">
                        <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {office.city}
                            <span className="ml-2 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              {office.type}
                            </span>
                          </div>
                          <div className="text-sm text-zinc-500 mt-1">{office.address}</div>
                          <div className="text-sm text-zinc-400 mt-1">{office.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-12">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Common Questions
              </span>
              <h2 className="text-4xl font-bold mt-4">
                Quick <span className="text-emerald-400">Answers</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-zinc-400">{faq.answer}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Mining Operations?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Join hundreds of mining companies using AI to improve safety and efficiency.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
            >
              Try AI Assistant Free <ChevronRight className="h-5 w-5" />
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
