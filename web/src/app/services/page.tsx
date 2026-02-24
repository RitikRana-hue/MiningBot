"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScrollProgress,
  GlowCard,
} from "@/components/animations/ScrollAnimations";
import {
  MessageSquare,
  BarChart3,
  Shield,
  Upload,
  Brain,
  Cpu,
  Database,
  Globe,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  LineChart,
  FileSearch,
  AlertTriangle,
  Gauge,
  Users,
  Headphones,
} from "lucide-react";
import Link from "next/link";

const mainServices = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "MineGPT",
    description:
      "24/7 intelligent chatbot trained on mining regulations, safety protocols, and operational best practices. Get instant answers to complex mining queries.",
    features: [
      "Natural language processing",
      "Multi-language support",
      "Context-aware responses",
      "Document analysis",
    ],
    color: "from-emerald-500/20 to-emerald-500/0",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Production Analytics",
    description:
      "Real-time dashboards and predictive analytics to optimize production, reduce downtime, and maximize operational efficiency.",
    features: [
      "Real-time monitoring",
      "Predictive maintenance",
      "Trend analysis",
      "Custom reports",
    ],
    color: "from-blue-500/20 to-blue-500/0",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Safety Management",
    description:
      "Comprehensive safety monitoring system with real-time alerts, compliance tracking, and incident prevention powered by AI.",
    features: [
      "Hazard detection",
      "Compliance monitoring",
      "Incident reporting",
      "Safety training",
    ],
    color: "from-amber-500/20 to-amber-500/0",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: <FileSearch className="h-8 w-8" />,
    title: "Document Intelligence",
    description:
      "Upload and analyze mining documents, reports, and data files. Extract insights from PDFs, Excel sheets, and images automatically.",
    features: [
      "PDF analysis",
      "Data extraction",
      "Image recognition",
      "Auto-summarization",
    ],
    color: "from-purple-500/20 to-purple-500/0",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
];

const additionalServices = [
  {
    icon: <Database className="h-6 w-6" />,
    title: "Data Integration",
    description: "Seamlessly connect with existing mining management systems and IoT sensors.",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Remote Monitoring",
    description: "Monitor multiple mine sites from anywhere with cloud-based dashboards.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Alert System",
    description: "Instant notifications for safety incidents, production anomalies, and equipment issues.",
  },
  {
    icon: <Gauge className="h-6 w-6" />,
    title: "Performance Metrics",
    description: "Track KPIs, benchmarks, and performance indicators across all operations.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Share insights, reports, and analysis with your entire team in real-time.",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Dedicated technical support team available around the clock.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Connect",
    description: "Integrate your existing systems and data sources with our platform.",
  },
  {
    step: "02",
    title: "Analyze",
    description: "Our AI processes your data to generate actionable insights.",
  },
  {
    step: "03",
    title: "Optimize",
    description: "Implement recommendations to improve safety and efficiency.",
  },
  {
    step: "04",
    title: "Scale",
    description: "Expand capabilities across all your mining operations.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ScrollProgress />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent" />
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <FadeInUp>
            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">
              <Sparkles className="h-4 w-4" />
              Our Services
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
              AI-Powered Solutions
              <span className="text-emerald-400"> for Mining</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Transform your mining operations with cutting-edge artificial intelligence,
              real-time analytics, and comprehensive safety management systems.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.map((service, i) => (
              <FadeInUp key={service.title} delay={i * 0.1}>
                <GlowCard
                  className={`group relative p-8 md:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-br ${service.color} hover:border-zinc-700 transition-all duration-500 h-full`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.iconBg} mb-6`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                How It Works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Simple <span className="text-emerald-400">Implementation</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <FadeInUp key={step.step} delay={i * 0.1}>
                <div className="relative">
                  <div className="text-7xl font-bold text-zinc-800 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-zinc-500">{step.description}</p>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-4 h-6 w-6 text-zinc-700" />
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Additional Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Everything You <span className="text-emerald-400">Need</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, i) => (
              <FadeInUp key={service.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-zinc-500">{service.description}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <FadeInUp delay={0.1}>
              <div className="text-5xl font-bold text-emerald-400 mb-2">99.9%</div>
              <div className="text-zinc-500">Uptime SLA</div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="text-5xl font-bold text-white mb-2">&lt;1s</div>
              <div className="text-zinc-500">Response Time</div>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <div className="text-5xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-zinc-500">Mines Served</div>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-zinc-500">Support</div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Get started with a free demo and see how AI can revolutionize your mining business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
              >
                Try AI Assistant <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-full hover:bg-zinc-800 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
