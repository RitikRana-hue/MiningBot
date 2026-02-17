"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, Thermometer, Droplets, Activity, TrendingUp, AlertTriangle } from "lucide-react";

// Simulated real-time AQI data
export function LiveAQI() {
  const [aqi, setAqi] = useState(85);
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable");

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      const newVal = Math.max(30, Math.min(200, aqi + change * Math.floor(Math.random() * 5)));
      setTrend(newVal > aqi ? "up" : newVal < aqi ? "down" : "stable");
      setAqi(newVal);
    }, 3000);
    return () => clearInterval(interval);
  }, [aqi]);

  const getAQIColor = (value: number) => {
    if (value <= 50) return "text-green-400";
    if (value <= 100) return "text-yellow-400";
    if (value <= 150) return "text-orange-400";
    return "text-red-400";
  };

  const getAQIStatus = (value: number) => {
    if (value <= 50) return "Good";
    if (value <= 100) return "Moderate";
    if (value <= 150) return "Unhealthy for Sensitive";
    return "Unhealthy";
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium text-zinc-400">Live AQI</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-green-500"
        />
      </div>
      <div className="flex items-end gap-3">
        <motion.span
          key={aqi}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-5xl font-bold ${getAQIColor(aqi)}`}
        >
          {aqi}
        </motion.span>
        <span className="text-sm text-zinc-500 mb-2">AQI</span>
        {trend === "up" && <TrendingUp className="h-4 w-4 text-red-400 mb-2" />}
        {trend === "down" && <TrendingUp className="h-4 w-4 text-green-400 mb-2 rotate-180" />}
      </div>
      <p className={`text-sm mt-2 ${getAQIColor(aqi)}`}>{getAQIStatus(aqi)}</p>
    </div>
  );
}

// Simulated production counter
export function ProductionCounter() {
  const [tonnes, setTonnes] = useState(156789);

  useEffect(() => {
    const interval = setInterval(() => {
      setTonnes((prev) => prev + Math.floor(Math.random() * 10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-medium text-zinc-400">Today&apos;s Production</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-blue-500"
        />
      </div>
      <motion.div
        key={tonnes}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold text-white"
      >
        {tonnes.toLocaleString()}
        <span className="text-lg text-zinc-500 ml-2">tonnes</span>
      </motion.div>
    </div>
  );
}

// Mine environment stats
export function MineEnvironment() {
  const [temp, setTemp] = useState(28);
  const [humidity, setHumidity] = useState(65);
  const [methane, setMethane] = useState(0.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp((prev) => Math.max(20, Math.min(35, prev + (Math.random() - 0.5))));
      setHumidity((prev) => Math.max(40, Math.min(90, prev + (Math.random() - 0.5) * 2)));
      setMethane((prev) => Math.max(0.1, Math.min(0.8, prev + (Math.random() - 0.5) * 0.1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
        <Thermometer className="h-6 w-6 text-orange-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{temp.toFixed(1)}°C</div>
        <div className="text-xs text-zinc-500">Temperature</div>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
        <Droplets className="h-6 w-6 text-blue-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{humidity.toFixed(0)}%</div>
        <div className="text-xs text-zinc-500">Humidity</div>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
        <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${methane > 0.5 ? "text-red-400" : "text-green-400"}`} />
        <div className="text-2xl font-bold text-white">{methane.toFixed(2)}%</div>
        <div className="text-xs text-zinc-500">Methane</div>
      </div>
    </div>
  );
}

// Big stat display
interface StatProps {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
}

export function AnimatedStat({ value, label, suffix = "", icon, color }: StatProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color} mb-4`}>
        {icon}
      </div>
      <div className="text-5xl md:text-6xl font-bold text-white mb-2">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-zinc-400">{label}</div>
    </motion.div>
  );
}
