"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chat");
  }, [router]);

  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400">Loading chat...</p>
      </div>
    </div>
  );
}
