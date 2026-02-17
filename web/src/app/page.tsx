import Link from "next/link";
import {
  HardHat,
  MessageSquare,
  Upload,
  Shield,
  BarChart3,
  ChevronRight,
  FileText,
  ImageIcon,
  Database,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <HardHat className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold">CoalMine AI</span>
            </div>
            <Link
              href="/chat"
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors"
            >
              Open Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-amber-900/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Your Intelligent{" "}
              <span className="text-emerald-400">Coal Mining</span>
              <br />
              Assistant
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              Get instant answers about coal mining operations, analyze your data,
              upload documents and photos for AI-powered insights.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
            >
              Start Chatting
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Preview */}
          <div className="mt-16 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden max-w-3xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-xs">U</div>
                <div className="bg-zinc-800 rounded-lg px-4 py-2 text-sm">
                  What are the safety requirements for underground coal mining?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                  <HardHat className="h-4 w-4" />
                </div>
                <div className="bg-zinc-800/50 rounded-lg px-4 py-2 text-sm text-zinc-300">
                  Coal mine safety involves: ventilation, ground control, PPE, gas monitoring, and emergency response plans...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <MessageSquare className="h-10 w-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Intelligent Chat</h3>
              <p className="text-zinc-400 text-sm">
                Ask about coal types, mining methods, safety, and equipment.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <Upload className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">File Analysis</h3>
              <p className="text-zinc-400 text-sm">
                Upload CSV, Excel, or PDF files for instant data analysis.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <ImageIcon className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Photo Analysis</h3>
              <p className="text-zinc-400 text-sm">
                Share photos of coal samples or sites for visual analysis.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <Shield className="h-10 w-10 text-amber-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Safety Guidance</h3>
              <p className="text-zinc-400 text-sm">
                Get comprehensive safety info including ventilation and methane control.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <BarChart3 className="h-10 w-10 text-red-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Production Insights</h3>
              <p className="text-zinc-400 text-sm">
                Analyze production data and get efficiency recommendations.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <Database className="h-10 w-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chat History</h3>
              <p className="text-zinc-400 text-sm">
                All conversations saved locally for easy access anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Knowledge Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              "Coal Types", "Surface Mining", "Underground Mining", "Longwall Mining",
              "Safety Regulations", "Ventilation", "Methane Control", "Dust Management",
              "Coal Quality", "Production Metrics", "Equipment", "Reclamation",
            ].map((topic) => (
              <div key={topic} className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm">
                <FileText className="h-4 w-4 text-emerald-500" />
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HardHat className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-zinc-400 mb-8">
            Start chatting with our AI assistant for all your coal mining questions.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-all shadow-lg"
          >
            Launch Chat Assistant
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-emerald-500" />
            <span className="font-semibold">CoalMine AI</span>
          </div>
          <p className="text-sm text-zinc-500">© 2024 CoalMine AI</p>
        </div>
      </footer>
    </div>
  );
}
