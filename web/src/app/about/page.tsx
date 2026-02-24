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
  HardHat,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
  Linkedin,
  Twitter,
  Building2,
  Sparkles,
  Lightbulb,
  Rocket,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: 500, suffix: "+", label: "Mines Monitored", color: "text-emerald-400" },
  { value: 50, suffix: "+", label: "Enterprise Clients", color: "text-white" },
  { value: 98, suffix: "%", label: "Customer Satisfaction", color: "text-emerald-400" },
  { value: 24, suffix: "/7", label: "Support Available", color: "text-white" },
];

const values = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Safety First",
    description:
      "Every decision we make prioritizes the safety of mining personnel. Our technology is built to protect lives.",
    color: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovation",
    description:
      "We constantly push the boundaries of what's possible with AI to deliver cutting-edge solutions.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Integrity",
    description:
      "We operate with complete transparency and honesty in all our dealings with clients and partners.",
    color: "bg-red-500/10 text-red-400",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaboration",
    description:
      "We work closely with our clients to understand their unique challenges and deliver tailored solutions.",
    color: "bg-purple-500/10 text-purple-400",
  },
];

const team = [
  {
    name: "Rajiv Sharma",
    role: "CEO & Founder",
    bio: "20+ years in mining technology, former CTO at Coal India Ltd.",
    image: "RS",
  },
  {
    name: "Dr. Priya Patel",
    role: "Chief AI Officer",
    bio: "PhD in Machine Learning, ex-Google AI researcher with focus on industrial applications.",
    image: "PP",
  },
  {
    name: "Amit Kumar",
    role: "Head of Safety",
    bio: "Former DGMS inspector with 15 years of mining safety experience.",
    image: "AK",
  },
  {
    name: "Sneha Reddy",
    role: "VP Engineering",
    bio: "Built scalable systems at Amazon and Flipkart, passionate about clean energy.",
    image: "SR",
  },
];

const milestones = [
  { year: "2019", title: "Company Founded", description: "Started with a vision to transform mining through AI" },
  { year: "2020", title: "First Product Launch", description: "Released our AI chat assistant for mining queries" },
  { year: "2021", title: "100 Mines", description: "Reached milestone of monitoring 100 mines across India" },
  { year: "2022", title: "Enterprise Launch", description: "Launched comprehensive enterprise solutions" },
  { year: "2023", title: "Safety Recognition", description: "Awarded for contribution to mining safety by DGMS" },
  { year: "2024", title: "500+ Mines", description: "Now serving over 500 mines with AI-powered solutions" },
];

const partners = [
  "Coal India Limited",
  "SCCL",
  "NTPC",
  "TATA Steel",
  "Adani Enterprises",
  "Vedanta",
];

export default function AboutPage() {
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
              Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
              Transforming Mining
              <span className="text-emerald-400"> with AI</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              We&apos;re on a mission to make mining safer, more efficient, and sustainable
              through the power of artificial intelligence.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeInUp key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className={`text-5xl md:text-6xl font-bold mb-2 ${stat.color}`}>
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-zinc-500">{stat.label}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeInLeft>
              <div className="bg-gradient-to-br from-emerald-900/30 to-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 h-full">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  To revolutionize the mining industry by providing AI-powered solutions that
                  prioritize safety, enhance operational efficiency, and drive sustainable practices.
                  We believe technology can protect lives while maximizing productivity.
                </p>
              </div>
            </FadeInLeft>

            <FadeInRight>
              <div className="bg-gradient-to-br from-blue-900/30 to-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 h-full">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  To become the global leader in AI-powered mining solutions, setting new standards
                  for safety and efficiency in the industry. We envision a future where every mining
                  operation is powered by intelligent technology.
                </p>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInLeft>
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Built by Mining
                <span className="text-emerald-400"> Experts</span>
              </h2>
              <p className="text-lg text-zinc-400 mb-6">
                MineGPT was founded by a team of mining industry veterans and AI researchers
                who saw the potential for technology to transform one of the world&apos;s oldest industries.
              </p>
              <p className="text-lg text-zinc-400 mb-8">
                After witnessing firsthand the challenges faced by mining operations — from safety
                incidents to inefficient processes — we set out to build solutions that could make
                a real difference. Today, we&apos;re proud to serve over 500 mines across India.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {team.slice(0, 4).map((member) => (
                    <div
                      key={member.name}
                      className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-sm font-medium"
                    >
                      {member.image}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-zinc-500">
                  Founded by industry experts with 50+ years combined experience
                </div>
              </div>
            </FadeInLeft>

            <FadeInRight>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                  <div className="space-y-6">
                    {milestones.slice(0, 4).map((milestone, i) => (
                      <div key={milestone.year} className="flex gap-4">
                        <div className="w-16 shrink-0">
                          <span className="text-emerald-400 font-bold">{milestone.year}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{milestone.title}</h4>
                          <p className="text-sm text-zinc-500">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                What We Stand For
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Our <span className="text-emerald-400">Values</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <FadeInUp key={value.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${value.color} mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-zinc-500">{value.description}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Meet the Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Leadership <span className="text-emerald-400">Team</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <FadeInUp key={member.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-emerald-400 text-sm mb-3">{member.role}</p>
                  <p className="text-zinc-500 text-sm">{member.bio}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <FadeInUp>
            <div className="text-center mb-16">
              <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4">
                Key <span className="text-emerald-400">Milestones</span>
              </h2>
            </div>
          </FadeInUp>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 hidden md:block" />

            {milestones.map((milestone, i) => (
              <FadeInUp key={milestone.year} delay={i * 0.1}>
                <div className={`flex items-center gap-8 mb-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 inline-block">
                      <span className="text-emerald-400 font-bold text-lg">{milestone.year}</span>
                      <h4 className="text-xl font-bold mt-1">{milestone.title}</h4>
                      <p className="text-zinc-500 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 bg-emerald-500 rounded-full shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <p className="text-center text-zinc-500 mb-12">Trusted by India&apos;s leading mining organizations</p>
          </FadeInUp>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {partners.map((partner, i) => (
              <FadeInUp key={partner} delay={i * 0.1}>
                <div className="text-2xl md:text-3xl font-bold text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer">
                  {partner}
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
            <Rocket className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Us in Transforming Mining
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Whether you&apos;re a mining company looking to modernize or a talented individual
              wanting to make an impact, we&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
              >
                Get in Touch <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-full hover:bg-zinc-800 transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
