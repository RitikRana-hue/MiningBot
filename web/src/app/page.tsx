"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  HardHat,
  MessageSquare,
  Upload,
  Shield,
  BarChart3,
  ChevronRight,
  ArrowDown,
  MapPin,
  Users,
  Zap,
  Globe,
  Play,
  Award,
  Clock,
  Layers,
  Target,
  Truck,
  Factory,
  Flame,
  Leaf,
  Star,
  Quote,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { ScrollProgress } from "@/components/animations/ScrollAnimations";
import {
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  Parallax,
  AnimatedCounter,
  MagneticButton,
  Float,
  GlowCard,
} from "@/components/animations/ScrollAnimations";
import { LiveAQI, ProductionCounter, MineEnvironment } from "@/components/LiveData";

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      <ScrollProgress />
      <Navigation />

      {/* HERO SECTION - Full screen with massive typography */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-zinc-950 to-zinc-950" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
          />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 pt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
              <Zap className="h-4 w-4" />
              AI-Powered Mining Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter mb-6"
          >
            <span className="block">COAL</span>
            <span className="block text-emerald-400">MINING</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl font-light text-zinc-500 mt-4">
              INTELLIGENCE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12"
          >
            Transform your mining operations with AI-powered insights,
            real-time monitoring, and intelligent data analysis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton>
              <Link
                href="/chat"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white text-lg font-semibold rounded-full overflow-hidden"
              >
                <span className="relative z-10">Start Free</span>
                <ChevronRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-emerald-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </MagneticButton>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-5 border border-zinc-700 text-zinc-300 text-lg font-medium rounded-full hover:bg-zinc-800/50 transition-colors"
            >
              <Play className="h-5 w-5" />
              View Live Data
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="h-6 w-6 text-zinc-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION - Big numbers */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold text-white mb-2">
                  <AnimatedCounter value={500} />+
                </div>
                <div className="text-zinc-500 text-lg">Mines Monitored</div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold text-emerald-400 mb-2">
                  <AnimatedCounter value={98} />%
                </div>
                <div className="text-zinc-500 text-lg">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold text-white mb-2">
                  <AnimatedCounter value={24} />/7
                </div>
                <div className="text-zinc-500 text-lg">Live Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-bold text-amber-400 mb-2">
                  <AnimatedCounter value={10} />M+
                </div>
                <div className="text-zinc-500 text-lg">Tonnes Tracked</div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* LIVE DATA PREVIEW */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Real-Time Monitoring
              </span>
              <h2 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
                Live Mine Data
              </h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Monitor environmental conditions, production metrics, and safety
                parameters in real-time.
              </p>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-6">
            <FadeInLeft delay={0.2}>
              <LiveAQI />
            </FadeInLeft>
            <FadeInUp delay={0.3}>
              <ProductionCounter />
            </FadeInUp>
            <FadeInRight delay={0.4}>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-zinc-400">Active Regions</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">12 States</div>
                <p className="text-sm text-zinc-500">Across India</p>
              </div>
            </FadeInRight>
          </div>

          <FadeInUp delay={0.5}>
            <div className="mt-6">
              <MineEnvironment />
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* FEATURES - Big cards with hover effects */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-20">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Powerful Features
              </span>
              <h2 className="text-5xl md:text-7xl font-bold mt-4">
                Everything You Need
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: "AI Chat Assistant",
                description:
                  "Get instant answers about coal mining, safety protocols, equipment, and best practices.",
                color: "from-emerald-500/20 to-emerald-500/0",
                iconBg: "bg-emerald-500/10 text-emerald-400",
              },
              {
                icon: <Upload className="h-8 w-8" />,
                title: "Document Analysis",
                description:
                  "Upload PDFs, Excel files, and images for AI-powered analysis and insights.",
                color: "from-blue-500/20 to-blue-500/0",
                iconBg: "bg-blue-500/10 text-blue-400",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Production Analytics",
                description:
                  "Track production metrics, identify trends, and optimize operations.",
                color: "from-purple-500/20 to-purple-500/0",
                iconBg: "bg-purple-500/10 text-purple-400",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Safety Monitoring",
                description:
                  "Real-time safety alerts, compliance tracking, and incident prevention.",
                color: "from-amber-500/20 to-amber-500/0",
                iconBg: "bg-amber-500/10 text-amber-400",
              },
            ].map((feature, i) => (
              <FadeInUp key={feature.title} delay={i * 0.1}>
                <GlowCard
                  className={`group relative p-8 md:p-12 rounded-3xl border border-zinc-800 bg-gradient-to-br ${feature.color} hover:border-zinc-700 transition-all duration-500`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.iconBg} mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/chat"
                      className="inline-flex items-center gap-2 text-emerald-400 font-medium group-hover:gap-3 transition-all"
                    >
                      Learn more <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </GlowCard>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* INDIA MINING HIGHLIGHT */}
      <section className="py-32 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInLeft>
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Made for India
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
                Comprehensive Coverage of
                <span className="text-emerald-400"> Indian Coal Mines</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Access detailed information on all major coal mining regions in
                India, including Jharkhand, Odisha, Chhattisgarh, West Bengal,
                and more.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <MapPin />, label: "400+ Mines" },
                  { icon: <Users />, label: "500K+ Workers" },
                  { icon: <BarChart3 />, label: "700MT+ Annual" },
                  { icon: <Shield />, label: "Safety First" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 text-zinc-300"
                  >
                    <div className="text-emerald-400">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  href="/india-mines"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
                >
                  Explore India Mines
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </FadeInLeft>
            <FadeInRight>
              <Parallax offset={30}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
                  <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <div className="aspect-square bg-zinc-800 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <HardHat className="h-24 w-24 text-emerald-500 mx-auto mb-4" />
                        <div className="text-4xl font-bold">Coal India Ltd</div>
                        <div className="text-zinc-500">World&apos;s Largest Coal Producer</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Parallax>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLLING TEXT */}
      <section className="py-12 overflow-hidden border-y border-zinc-800">
        <motion.div
          animate={{ x: ["-100%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-8 text-6xl md:text-8xl font-bold text-zinc-800">
              <span>COAL MINING</span>
              <span className="text-emerald-900">•</span>
              <span>INTELLIGENCE</span>
              <span className="text-emerald-900">•</span>
              <span>SAFETY FIRST</span>
              <span className="text-emerald-900">•</span>
              <span>REAL-TIME DATA</span>
              <span className="text-emerald-900">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* COAL TYPES SHOWCASE */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                Know Your Coal
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4">
                Types of <span className="text-amber-400">Coal</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Anthracite", carbon: "86-97%", color: "from-zinc-600 to-zinc-900", desc: "Highest grade, burns cleanest" },
              { name: "Bituminous", carbon: "45-86%", color: "from-zinc-700 to-zinc-950", desc: "Most commonly used" },
              { name: "Sub-bituminous", carbon: "35-45%", color: "from-amber-900 to-zinc-900", desc: "Lower sulfur content" },
              { name: "Lignite", carbon: "25-35%", color: "from-amber-800 to-amber-950", desc: "Brown coal, high moisture" },
            ].map((coal, i) => (
              <FadeInUp key={coal.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative h-80 rounded-3xl bg-gradient-to-b ${coal.color} p-6 flex flex-col justify-end overflow-hidden group`}
                >
                  <div className="absolute top-4 right-4 text-5xl font-bold text-white/10">
                    {coal.carbon}
                  </div>
                  <Flame className="h-12 w-12 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-2">{coal.name}</h3>
                  <p className="text-zinc-400 text-sm">{coal.desc}</p>
                  <div className="mt-4 text-amber-400 text-sm font-medium">
                    Carbon: {coal.carbon}
                  </div>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Why Choose Us
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4">
                Built for <span className="text-emerald-400">Excellence</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Large card */}
            <FadeInLeft>
              <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-emerald-900/50 to-zinc-900 border border-zinc-800 rounded-3xl p-8 h-full">
                <Award className="h-12 w-12 text-emerald-400 mb-6" />
                <h3 className="text-4xl font-bold mb-4">Industry Leading<br />Technology</h3>
                <p className="text-zinc-400 text-lg mb-6">
                  Our AI has been trained on millions of data points from real mining operations,
                  providing unmatched accuracy and insights.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-emerald-400">99.9%</div>
                    <div className="text-sm text-zinc-500">Uptime</div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-emerald-400">&lt;1s</div>
                    <div className="text-sm text-zinc-500">Response Time</div>
                  </div>
                </div>
              </div>
            </FadeInLeft>

            <FadeInUp delay={0.1}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <Clock className="h-8 w-8 text-blue-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">24/7 Monitoring</h4>
                <p className="text-zinc-500 text-sm">Round the clock surveillance of all operations</p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <Layers className="h-8 w-8 text-purple-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Multi-layer Analysis</h4>
                <p className="text-zinc-500 text-sm">Deep insights from surface to underground</p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <Target className="h-8 w-8 text-red-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Precision Targeting</h4>
                <p className="text-zinc-500 text-sm">Identify optimal extraction points</p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <Leaf className="h-8 w-8 text-green-400 mb-4" />
                <h4 className="text-xl font-bold mb-2">Eco Compliance</h4>
                <p className="text-zinc-500 text-sm">Meet all environmental regulations</p>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* MINING PROCESS TIMELINE */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-20">
              <span className="text-cyan-400 text-sm font-medium tracking-wider uppercase">
                The Journey
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4">
                Mining <span className="text-cyan-400">Process</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-500 to-transparent hidden md:block" />

            {[
              { icon: <Target />, title: "Exploration", desc: "Geological surveys and reserve estimation", side: "left" },
              { icon: <Layers />, title: "Planning", desc: "Mine design and safety protocols", side: "right" },
              { icon: <Factory />, title: "Extraction", desc: "Surface or underground mining operations", side: "left" },
              { icon: <Truck />, title: "Transportation", desc: "Moving coal to processing facilities", side: "right" },
              { icon: <Flame />, title: "Processing", desc: "Cleaning and grading coal", side: "left" },
              { icon: <Leaf />, title: "Reclamation", desc: "Environmental restoration", side: "right" },
            ].map((step, i) => (
              <FadeInUp key={step.title} delay={i * 0.1}>
                <div className={`flex items-center gap-8 mb-12 ${step.side === "right" ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${step.side === "right" ? "md:text-right" : ""}`}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 inline-block">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                          {step.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{step.title}</h4>
                          <p className="text-zinc-500">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-cyan-500 rounded-full items-center justify-center text-white font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                Trusted By Industry Leaders
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mt-4">
                What They <span className="text-amber-400">Say</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rajesh Kumar", role: "Mine Manager, CCL", text: "CoalMine AI has transformed how we monitor safety. Incident rates dropped by 40% in the first year." },
              { name: "Priya Sharma", role: "Operations Head, SECL", text: "The real-time data analytics helped us optimize production and reduce operational costs significantly." },
              { name: "Amit Patel", role: "Safety Officer, MCL", text: "The AI assistant provides instant answers to complex safety queries. It's like having an expert available 24/7." },
            ].map((testimonial, i) => (
              <FadeInUp key={testimonial.name} delay={i * 0.1}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative">
                  <Quote className="h-10 w-10 text-amber-500/20 absolute top-6 right-6" />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-6">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-zinc-500">{testimonial.role}</div>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS LOGOS */}
      <section className="py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <p className="text-center text-zinc-500 mb-12">Trusted by India&apos;s largest mining organizations</p>
          </FadeInUp>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {["Coal India", "SCCL", "NTPC", "TATA Steel", "Adani", "Vedanta"].map((partner, i) => (
              <FadeInUp key={partner} delay={i * 0.1}>
                <div className="text-2xl md:text-3xl font-bold text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer">
                  {partner}
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4">
          <FadeInUp>
            <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border border-zinc-800 rounded-3xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-zinc-400 mb-8">
                Get the latest mining insights, safety updates, and industry news delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-full hover:bg-emerald-400 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-emerald-600/20" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <ScaleIn>
            <Float>
              <HardHat className="h-24 w-24 text-emerald-500 mx-auto mb-8" />
            </Float>
          </ScaleIn>
          <FadeInUp delay={0.2}>
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              Ready to Transform
              <br />
              <span className="text-emerald-400">Your Operations?</span>
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <p className="text-xl text-zinc-400 mb-10">
              Join hundreds of mining operations using AI to improve safety,
              efficiency, and productivity.
            </p>
          </FadeInUp>
          <FadeInUp delay={0.6}>
            <MagneticButton>
              <Link
                href="/chat"
                className="inline-flex items-center gap-3 px-12 py-6 bg-white text-zinc-900 text-xl font-bold rounded-full hover:bg-zinc-100 transition-colors"
              >
                Get Started Now
                <ChevronRight className="h-6 w-6" />
              </Link>
            </MagneticButton>
          </FadeInUp>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <HardHat className="h-8 w-8 text-emerald-500" />
                <span className="text-xl font-bold">CoalMine AI</span>
              </div>
              <p className="text-zinc-500">
                AI-powered intelligence for modern mining operations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-zinc-400">
                <Link href="/chat" className="block hover:text-white">Chat Assistant</Link>
                <Link href="/dashboard" className="block hover:text-white">Live Dashboard</Link>
                <Link href="/india-mines" className="block hover:text-white">India Mines</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-zinc-400">
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/services" className="block hover:text-white">Services</Link>
                <Link href="/contact" className="block hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-zinc-400">
                <Link href="/safety" className="block hover:text-white">Safety Guide</Link>
                <Link href="/dashboard" className="block hover:text-white">Data Analytics</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-500">© 2024 CoalMine AI. All rights reserved.</p>
            <div className="flex items-center gap-6 text-zinc-400">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
