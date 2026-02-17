import { NextRequest, NextResponse } from "next/server";

interface KnowledgeBase {
  [key: string]: string;
}

const knowledgeBase: KnowledgeBase = {
  bitcoin:
    "Bitcoin (BTC) is the first and most well-known cryptocurrency. It uses the SHA-256 algorithm for mining and requires specialized ASIC hardware for profitable mining.",
  ethereum:
    "Ethereum transitioned to Proof of Stake (PoS) in September 2022 with 'The Merge'. Traditional GPU mining is no longer possible for ETH. Validators now secure the network by staking ETH.",
  gpu: "GPU mining uses graphics cards to solve cryptographic puzzles. Popular GPUs for mining include NVIDIA RTX 3080, RTX 4090, and AMD RX 6800 XT. GPUs are versatile and can mine various altcoins.",
  asic: "ASIC (Application-Specific Integrated Circuit) miners are specialized hardware designed for specific mining algorithms. They offer superior hashrate and efficiency but can only mine specific coins. Popular manufacturers include Bitmain, MicroBT, and Canaan.",
  pool: "Mining pools allow miners to combine their computational power and share rewards proportionally. Popular pools include F2Pool, Antpool, Foundry USA, and ViaBTC. Joining a pool provides more consistent payouts.",
  hashrate:
    "Hashrate measures the computational power used in mining. Common units: H/s (hashes per second), KH/s (kilo), MH/s (mega), GH/s (giga), TH/s (tera), PH/s (peta), EH/s (exa).",
  difficulty:
    "Mining difficulty adjusts automatically based on network hashrate to maintain consistent block times. Higher difficulty means more computational power is needed to mine a block.",
  profitability:
    "Mining profitability depends on: hardware costs, electricity rates ($/kWh), coin price, network difficulty, and pool fees. Use calculators like WhatToMine or NiceHash to estimate profits.",
  wallet:
    "A cryptocurrency wallet is essential for receiving mining rewards. Hardware wallets (Ledger, Trezor) offer the best security. Software wallets and exchange wallets are convenient but less secure.",
  litecoin:
    "Litecoin (LTC) uses the Scrypt algorithm. It can be mined with both ASICs and GPUs, though ASICs are more efficient. Block time is 2.5 minutes, 4x faster than Bitcoin.",
  monero:
    "Monero (XMR) uses the RandomX algorithm, specifically designed for CPU mining. It's one of the most profitable coins for CPU miners and focuses on privacy.",
  ravencoin:
    "Ravencoin (RVN) uses the KAWPOW algorithm, which is ASIC-resistant and GPU-friendly. It's popular among GPU miners looking for alternatives to ETH.",
  electricity:
    "Electricity cost is the biggest ongoing expense in mining. Profitable mining typically requires rates below $0.10/kWh. Many miners seek locations with cheap hydroelectric or renewable energy.",
  cooling:
    "Mining hardware generates significant heat. Proper cooling is essential for longevity and efficiency. Options include air cooling, immersion cooling, and strategic placement in cold climates.",
  roi: "ROI (Return on Investment) for mining depends on hardware costs, operating expenses, and market conditions. Typical ROI periods range from 6 months to 2+ years depending on the setup.",
};

const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "howdy"];
const farewells = ["bye", "goodbye", "see you", "farewell", "quit", "exit"];

function getResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();

  // Check for greetings
  if (greetings.some((g) => input.includes(g))) {
    return "Hello! I'm your Mining Assistant. I can help you with cryptocurrency mining topics like:\n\n• Bitcoin, Ethereum, Litecoin, Monero, Ravencoin\n• GPU and ASIC mining hardware\n• Mining pools and wallets\n• Hashrate, difficulty, and profitability\n• Electricity costs and cooling\n\nWhat would you like to know?";
  }

  // Check for farewells
  if (farewells.some((f) => input.includes(f))) {
    return "Goodbye! Happy mining! Feel free to come back if you have more questions. ⛏️";
  }

  // Search knowledge base
  for (const [keyword, info] of Object.entries(knowledgeBase)) {
    if (input.includes(keyword)) {
      return info;
    }
  }

  // Check for general mining questions
  if (input.includes("mining") || input.includes("mine") || input.includes("miner")) {
    return "Mining is the process of validating transactions and adding them to a blockchain by solving complex mathematical puzzles. Miners are rewarded with cryptocurrency for their work. Would you like to know about specific coins, hardware (GPU/ASIC), pools, or profitability?";
  }

  if (input.includes("start") || input.includes("begin") || input.includes("how to")) {
    return "To start mining, you'll need:\n\n1. **Hardware**: GPU or ASIC miner depending on the coin\n2. **Wallet**: To receive your mining rewards\n3. **Mining Software**: Like NiceHash, PhoenixMiner, or T-Rex\n4. **Pool**: Join a mining pool for consistent rewards\n5. **Electricity**: Ensure you have affordable power rates\n\nWhich aspect would you like to learn more about?";
  }

  if (input.includes("best") || input.includes("recommend")) {
    return "The 'best' option depends on your situation:\n\n• **Best for beginners**: NiceHash (easy setup, pays in BTC)\n• **Best CPU coin**: Monero (XMR)\n• **Best GPU coins**: Ravencoin, Ergo, Flux\n• **Best ROI**: Depends on your electricity cost and hardware\n\nWhat's your current setup or budget?";
  }

  // Default response
  return "I'm not sure about that specific topic. I specialize in cryptocurrency mining. Try asking about:\n\n• Specific coins (Bitcoin, Ethereum, Monero, etc.)\n• Mining hardware (GPU, ASIC)\n• Mining pools and wallets\n• Hashrate and difficulty\n• Profitability and electricity costs\n\nHow can I help you with mining?";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = getResponse(message);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
