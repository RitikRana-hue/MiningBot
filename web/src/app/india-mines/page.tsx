"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { FadeInUp, FadeInLeft, FadeInRight, AnimatedCounter, ScrollProgress } from "@/components/animations/ScrollAnimations";
import { MapPin, Users, TrendingUp, Factory, ChevronRight } from "lucide-react";
import Link from "next/link";

const states = [
  {
    name: "Jharkhand",
    mines: 112,
    production: "135 MT",
    workers: "125,000",
    companies: ["CCL", "BCCL", "ECL"],
    color: "bg-emerald-500",
  },
  {
    name: "Odisha",
    mines: 89,
    production: "180 MT",
    workers: "95,000",
    companies: ["MCL", "TATA Steel"],
    color: "bg-blue-500",
  },
  {
    name: "Chhattisgarh",
    mines: 76,
    production: "165 MT",
    workers: "88,000",
    companies: ["SECL", "Private Mines"],
    color: "bg-amber-500",
  },
  {
    name: "West Bengal",
    mines: 45,
    production: "32 MT",
    workers: "52,000",
    companies: ["ECL", "BCCL"],
    color: "bg-purple-500",
  },
  {
    name: "Madhya Pradesh",
    mines: 52,
    production: "120 MT",
    workers: "65,000",
    companies: ["SECL", "NCL"],
    color: "bg-red-500",
  },
  {
    name: "Telangana",
    mines: 38,
    production: "65 MT",
    workers: "45,000",
    companies: ["SCCL"],
    color: "bg-cyan-500",
  },
];

const majorCompanies = [
  { name: "Coal India Limited", production: "622 MT", mines: 352, employees: "272,000" },
  { name: "Singareni Collieries", production: "65 MT", mines: 27, employees: "48,000" },
  { name: "NTPC", production: "20 MT", mines: 8, employees: "12,000" },
  { name: "Private Sector", production: "85 MT", mines: 45, employees: "35,000" },
];

export default function IndiaMinesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ScrollProgress />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <FadeInUp>
            <span className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
              Coal Mining in India
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
              India&apos;s Coal
              <span className="text-emerald-400"> Mining Map</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl">
              Explore comprehensive data on India&apos;s coal mining industry - the world&apos;s
              second-largest coal producer with over 400 operational mines.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FadeInUp delay={0.1}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  <AnimatedCounter value={893} />
                </div>
                <div className="text-zinc-500">Total Mines</div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-emerald-400 mb-2">
                  <AnimatedCounter value={893} />
                  <span className="text-3xl">MT</span>
                </div>
                <div className="text-zinc-500">Annual Production</div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.3}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                  <AnimatedCounter value={500} />K+
                </div>
                <div className="text-zinc-500">Workers</div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.4}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2">
                  <AnimatedCounter value={12} />
                </div>
                <div className="text-zinc-500">States</div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* State-wise Data */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              State-wise <span className="text-emerald-400">Mining Data</span>
            </h2>
          </FadeInUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map((state, i) => (
              <FadeInUp key={state.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`w-3 h-3 rounded-full ${state.color} mb-2`} />
                      <h3 className="text-2xl font-bold">{state.name}</h3>
                    </div>
                    <MapPin className="h-5 w-5 text-zinc-600" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-emerald-400">{state.mines}</div>
                      <div className="text-xs text-zinc-500">Mines</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{state.production}</div>
                      <div className="text-xs text-zinc-500">Production</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{state.workers}</div>
                      <div className="text-xs text-zinc-500">Workers</div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4">
                    <div className="text-xs text-zinc-500 mb-2">Major Companies</div>
                    <div className="flex flex-wrap gap-2">
                      {state.companies.map((company) => (
                        <span
                          key={company}
                          className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Major Companies */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Major <span className="text-emerald-400">Coal Companies</span>
            </h2>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-6">
            {majorCompanies.map((company, i) => (
              <FadeInUp key={company.name} delay={i * 0.1}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6">{company.name}</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">Production</span>
                      </div>
                      <div className="text-3xl font-bold text-emerald-400">{company.production}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <Factory className="h-4 w-4" />
                        <span className="text-sm">Mines</span>
                      </div>
                      <div className="text-3xl font-bold">{company.mines}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-zinc-500 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Employees</span>
                      </div>
                      <div className="text-3xl font-bold">{company.employees}</div>
                    </div>
                  </div>
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
              Get Detailed Mining Insights
            </h2>
            <p className="text-xl text-zinc-400 mb-8">
              Chat with our AI assistant for real-time data and analysis on any Indian coal mine.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
            >
              Start Chatting <ChevronRight className="h-5 w-5" />
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
