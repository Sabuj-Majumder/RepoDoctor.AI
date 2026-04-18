import { Hero } from "@/components/hero";
import { motion } from "framer-motion";
import { 
  FileText, 
  FolderTree, 
  Activity, 
  Wrench, 
  ShieldCheck,
  Sparkles,
  Zap,
  BarChart3,
  Download
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "README Analysis",
    description: "Evaluates documentation quality, installation guides, usage examples, and badges.",
  },
  {
    icon: FolderTree,
    title: "Structure Review",
    description: "Checks project organization, folder structure, and configuration files.",
  },
  {
    icon: Activity,
    title: "Activity Metrics",
    description: "Analyzes commit frequency, issue management, and contributor engagement.",
  },
  {
    icon: Wrench,
    title: "Maintainability",
    description: "Identifies code smells, large files, and documentation gaps.",
  },
  {
    icon: ShieldCheck,
    title: "Best Practices",
    description: "Verifies licenses, CI/CD workflows, security policies, and templates.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations powered by local LLMs via Ollama.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Complete repository scan in seconds with comprehensive metrics.",
  },
  {
    icon: BarChart3,
    title: "Visual Reports",
    description: "Beautiful charts and visualizations of your repository health.",
  },
  {
    icon: Download,
    title: "Export Options",
    description: "Download PDF reports or copy Markdown summaries to share.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      
      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Comprehensive Analysis
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Five key areas evaluated for a complete repository health check
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-y border-white/10 bg-white/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Why RepoDoctor?
              </h2>
              <p className="mt-4 text-lg text-white/60">
                Built for maintainers who care about code quality and community engagement.
              </p>
              
              <div className="mt-8 space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <benefit.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{benefit.title}</h3>
                      <p className="text-sm text-white/60">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Overall Score</span>
                    <span className="text-2xl font-bold text-green-400">87/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    {[
                      { label: "README Quality", score: 18 },
                      { label: "Project Structure", score: 16 },
                      { label: "Activity", score: 19 },
                      { label: "Maintainability", score: 17 },
                      { label: "Best Practices", score: 17 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-white">{item.score}/20</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to analyze your repository?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Get started in seconds. No signup required.
          </p>
          <a
            href="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Analyzing
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
