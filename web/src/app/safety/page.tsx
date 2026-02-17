"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScrollProgress,
  AnimatedCounter,
} from "@/components/animations/ScrollAnimations";
import {
  Shield,
  AlertTriangle,
  HardHat,
  Eye,
  Wind,
  Flame,
  Droplets,
  Activity,
  FileCheck,
  Users,
  Bell,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Siren,
  HeartPulse,
  Radio,
  Lightbulb,
  ThermometerSun,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const safetyMetrics = [
  { label: "Safety Score", value: 98, suffix: "%", color: "text-emerald-400" },
  { label: "Days Without Incident", value: 847, suffix: "", color: "text-white" },
  { label: "Workers Protected", value: 500, suffix: "K+", color: "text-emerald-400" },
  { label: "Mines Monitored", value: 500, suffix: "+", color: "text-white" },
];

const hazardTypes = [
  {
    icon: <Wind className="h-8 w-8" />,
    title: "Gas Detection",
    description: "Real-time monitoring of methane, CO, CO2, and other hazardous gases with instant alerts.",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: "Fire Prevention",
    description: "Advanced thermal imaging and smoke detection systems to prevent underground fires.",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    icon: <Droplets className="h-8 w-8" />,
    title: "Water Ingress",
    description: "Monitoring of water levels and pump systems to prevent flooding incidents.",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Ground Stability",
    description: "Continuous monitoring of roof support systems and ground movement detection.",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    icon: <ThermometerSun className="h-8 w-8" />,
    title: "Heat Stress",
    description: "Temperature and humidity monitoring to protect workers from heat-related illness.",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    icon: <Volume2 className="h-8 w-8" />,
    title: "Noise Monitoring",
    description: "Tracking noise levels to prevent hearing damage and ensure compliance.",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
];

const safetyProtocols = [
  {
    title: "Pre-Shift Safety Checks",
    items: [
      "Personal protective equipment inspection",
      "Gas detection device calibration",
      "Communication system testing",
      "Emergency equipment verification",
    ],
  },
  {
    title: "Underground Operations",
    items: [
      "Continuous ventilation monitoring",
      "Roof support system inspection",
      "Electrical equipment safety checks",
      "Regular methane level readings",
    ],
  },
  {
    title: "Emergency Procedures",
    items: [
      "Evacuation route familiarity",
      "Self-rescuer usage training",
      "Emergency assembly points",
      "Communication protocols",
    ],
  },
  {
    title: "Post-Shift Requirements",
    items: [
      "Equipment storage protocols",
      "Incident reporting completion",
      "Area security verification",
      "Shift handover documentation",
    ],
  },
];

const emergencyFeatures = [
  {
    icon: <Siren className="h-6 w-6" />,
    title: "Instant Alerts",
    description: "Automated emergency notifications to all personnel within seconds",
  },
  {
    icon: <Radio className="h-6 w-6" />,
    title: "Communication Systems",
    description: "Redundant communication channels for reliable emergency coordination",
  },
  {
    icon: <HeartPulse className="h-6 w-6" />,
    title: "Medical Response",
    description: "Integrated first-aid guidance and emergency medical team coordination",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Personnel Tracking",
    description: "Real-time location tracking of all underground personnel",
  },
];

const regulations = [
  { name: "Mines Act, 1952", description: "Primary legislation governing mining safety in India" },
  { name: "Coal Mines Regulations, 2017", description: "Comprehensive safety standards for coal mining" },
  { name: "DGMS Guidelines", description: "Directorate General of Mines Safety circulars and standards" },
  { name: "ISO 45001", description: "International occupational health and safety standard" },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ScrollProgress />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent" />
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <FadeInUp>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                Safety First
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
              Mining Safety
              <span className="text-amber-400"> Standards</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Comprehensive safety monitoring, hazard detection, and compliance management 
              to protect every worker in your mining operations.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Safety Metrics */}
      <section className="py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {safetyMetrics.map((metric, i) => (
              <FadeInUp key={metric.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className={`text-5xl md:text-6xl font-bold mb-2 ${metric.color}`}>
                    <AnimatedCounter value={metric.value} />
                    {metric.suffix}
                  </div>
                  <div className="text-zinc-500">{metric.label}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Hazard Monitoring */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                Hazard Detection
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Real-Time <span className="text-amber-400">Monitoring</span>
              </h2>
              <p className="text-xl text-zinc-400 mt-4 max-w-2xl mx-auto">
                AI-powered systems continuously monitor for potential hazards and alert teams instantly.
              </p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hazardTypes.map((hazard, i) => (
              <FadeInUp key={hazard.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`border rounded-2xl p-6 ${hazard.color} transition-all`}
                >
                  <div className="mb-4">{hazard.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{hazard.title}</h3>
                  <p className="text-zinc-400">{hazard.description}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Protocols */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Best Practices
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Safety <span className="text-emerald-400">Protocols</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-8">
            {safetyProtocols.map((protocol, i) => (
              <FadeInUp key={protocol.title} delay={i * 0.1}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FileCheck className="h-6 w-6 text-emerald-400" />
                    {protocol.title}
                  </h3>
                  <ul className="space-y-4">
                    {protocol.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-zinc-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Response */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInLeft>
              <span className="text-red-400 text-sm font-medium tracking-wider uppercase">
                Emergency Response
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Rapid Response
                <span className="text-red-400"> System</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Our integrated emergency management system ensures quick response times 
                and coordinated action during critical situations.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {emergencyFeatures.map((feature, i) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-zinc-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInLeft>

            <FadeInRight>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Emergency Alert</h3>
                      <p className="text-zinc-500">Automated response system</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                      <span className="text-zinc-400">Detection Time</span>
                      <span className="text-emerald-400 font-bold">&lt; 1 second</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                      <span className="text-zinc-400">Alert Dispatch</span>
                      <span className="text-emerald-400 font-bold">&lt; 3 seconds</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                      <span className="text-zinc-400">Team Notification</span>
                      <span className="text-emerald-400 font-bold">&lt; 10 seconds</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl">
                      <span className="text-zinc-400">Response Coordination</span>
                      <span className="text-emerald-400 font-bold">Automated</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Regulatory Compliance
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Industry <span className="text-emerald-400">Standards</span>
              </h2>
              <p className="text-xl text-zinc-400 mt-4 max-w-2xl mx-auto">
                Stay compliant with all mining safety regulations and international standards.
              </p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regulations.map((reg, i) => (
              <FadeInUp key={reg.name} delay={i * 0.1}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full">
                  <BookOpen className="h-8 w-8 text-emerald-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2">{reg.name}</h3>
                  <p className="text-sm text-zinc-500">{reg.description}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInUp>
            <div className="bg-gradient-to-r from-amber-900/30 to-emerald-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Lightbulb className="h-8 w-8 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Safety Tip of the Day</h3>
                  <p className="text-zinc-400">
                    Always perform a thorough inspection of your personal protective equipment before 
                    entering the mine. Check for any damage to your helmet, lamp, self-rescuer, and 
                    other safety gear. Report any defects immediately.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                  #PPE
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                  #SafetyFirst
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  #MinerSafety
                </span>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeInUp>
            <HardHat className="h-16 w-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prioritize Safety in Your Operations
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Get AI-powered safety monitoring and compliance management for your mining operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-500 transition-colors"
              >
                Ask Safety Questions <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-full hover:bg-zinc-800 transition-colors"
              >
                Request Demo
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
