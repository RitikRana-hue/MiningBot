"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { ScrollProgress, FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/ScrollAnimations";
import { LiveAQI, ProductionCounter, MineEnvironment } from "@/components/LiveData";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Wind,
  Thermometer,
  Clock,
  MapPin,
  BarChart3,
  Zap,
} from "lucide-react";

// Simulated live data
function useLiveData() {
  const [data, setData] = useState({
    totalProduction: 156789,
    activeMiners: 12456,
    incidents: 2,
    efficiency: 94.5,
    activeMines: 342,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        totalProduction: prev.totalProduction + Math.floor(Math.random() * 10),
        activeMiners: 12456 + Math.floor(Math.random() * 100 - 50),
        incidents: Math.random() > 0.95 ? prev.incidents + 1 : prev.incidents,
        efficiency: 94 + Math.random() * 2,
        activeMines: 340 + Math.floor(Math.random() * 5),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

// Regional data
const regions = [
  { name: "Jharkhand", production: 45678, trend: "up", status: "active" },
  { name: "Odisha", production: 38901, trend: "up", status: "active" },
  { name: "Chhattisgarh", production: 32456, trend: "down", status: "active" },
  { name: "West Bengal", production: 18234, trend: "up", status: "maintenance" },
  { name: "Madhya Pradesh", production: 28901, trend: "up", status: "active" },
  { name: "Telangana", production: 15678, trend: "down", status: "active" },
];

export default function DashboardPage() {
  const liveData = useLiveData();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <ScrollProgress />
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeInUp>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Live <span className="text-emerald-400">Dashboard</span>
                </h1>
                <p className="text-zinc-400">Real-time coal mining operations monitoring</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-green-500"
                />
                <div className="text-right">
                  <div className="text-sm text-zinc-500">Last Updated</div>
                  <div className="font-mono text-lg">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Main Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <FadeInUp delay={0.1}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Today&apos;s Production</span>
                </div>
                <motion.div
                  key={liveData.totalProduction}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  {liveData.totalProduction.toLocaleString()}
                  <span className="text-sm text-zinc-500 ml-1">tonnes</span>
                </motion.div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Active Mines</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400">
                  {liveData.activeMines}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Efficiency</span>
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {liveData.efficiency.toFixed(1)}%
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Active Workers</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {liveData.activeMiners.toLocaleString()}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.5}>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Incidents Today</span>
                </div>
                <div className={`text-3xl font-bold ${liveData.incidents > 0 ? "text-amber-400" : "text-green-400"}`}>
                  {liveData.incidents}
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Live Data Widgets */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <FadeInLeft>
              <LiveAQI />
            </FadeInLeft>
            <FadeInUp>
              <ProductionCounter />
            </FadeInUp>
            <FadeInRight>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-zinc-400">Shift Status</span>
                </div>
                <div className="text-4xl font-bold text-white mb-2">Morning Shift</div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <motion.div
                      className="bg-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <span className="text-sm text-zinc-500">65%</span>
                </div>
              </div>
            </FadeInRight>
          </div>

          {/* Environment Monitor */}
          <FadeInUp>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Environment Monitoring</h2>
              <MineEnvironment />
            </div>
          </FadeInUp>

          {/* Regional Production */}
          <FadeInUp>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6">Regional Production</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regions.map((region) => (
                  <div
                    key={region.name}
                    className="bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            region.status === "active" ? "bg-green-500" : "bg-amber-500"
                          }`}
                        />
                        <span className="font-medium">{region.name}</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {region.production.toLocaleString()}
                        <span className="text-sm text-zinc-500 ml-1">t</span>
                      </div>
                    </div>
                    <div className={region.trend === "up" ? "text-green-400" : "text-red-400"}>
                      {region.trend === "up" ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
