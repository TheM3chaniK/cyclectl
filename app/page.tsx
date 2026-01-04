import { Metadata } from 'next';
import { Rocket, Github } from 'lucide-react';
import { AnimatedHero } from '@/components/animated-hero';
import { ScrollIndicator } from '@/components/scroll-indicator';


export const metadata: Metadata = {
  title: 'CycleCTL – Yearly Execution Control System | Monthly Goal Tracking & Task Management',
  description: 'CycleCTL helps you transform your annual goals into achievable monthly missions. Control your execution cycles, track progress, manage tasks, and ship outcomes with discipline and precision. Ideal for developers and individuals seeking a robust productivity and discipline system.',
  keywords: [
    'yearly planner',
    'execution system',
    'monthly goal tracking',
    'task management',
    'productivity system',
    'developer workflow',
    'discipline system',
    'project management',
    'team collaboration',
    'kanban board',
    'agile tool',
    'goal setting',
  ],
  openGraph: {
    title: 'CycleCTL – Yearly Execution Control System',
    description: 'Transform your annual goals into monthly missions. Control the cycle. Ship the outcome.',
    url: 'https://cyclectl.them3chanik.com',
    siteName: 'CycleCTL',
    images: [
      {
        url: 'https://cyclectl.them3chanik.com/og-image.jpg', // Replace with an actual OG image
        width: 1200,
        height: 630,
        alt: 'CycleCTL - Control the Cycle. Ship the Outcome.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CycleCTL – Yearly Execution Control System',
    description: 'Transform your annual goals into monthly missions. Control the cycle. Ship the outcome.',
    creator: '@them3chanik', // Replace with actual Twitter handle
    images: ['https://cyclectl.them3chanik.com/twitter-image.jpg'], // Replace with an actual Twitter image
  },
  alternates: {
    canonical: 'https://cyclectl.them3chanik.com',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-hidden">
      {/* Background Gradient & Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent z-0" />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center py-20 px-4">
        <AnimatedHero />
        <ScrollIndicator />
      </section>

      <main className="relative z-10 container mx-auto px-4 py-16 space-y-24">
        {/* What is CycleCTL Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-6 drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            What is CycleCTL?
          </h2>
          <p className="text-lg md:text-xl text-cyan-500/70 leading-relaxed">
            CycleCTL is not just another task planner; it's a **yearly execution control system** designed to bring discipline and clarity to your long-term goals. Instead of open-ended planning, CycleCTL helps you break down grand visions into **fixed monthly execution cycles, or "missions."** It's about committing to a finite period of focused work, shipping tangible outcomes, and then resetting for the next cycle. This system fosters a mindset of continuous delivery and measurable progress, ensuring your goals don't just exist on paper, but are actively shipped into reality.
          </p>
        </section>

        {/* How it Works Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-12 text-center drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
              <Rocket className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold font-mono text-white mb-2">1. Define Monthly Missions</h3>
              <p className="text-cyan-500/70">
                Translate your annual objectives into concrete, achievable missions for each month. Each mission has a clear start and end.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
              <img src="/path/to/icon-cycle.svg" alt="Cycle Icon" className="w-12 h-12 text-cyan-400 mb-4" /> {/* Placeholder */}
              <h3 className="text-2xl font-bold font-mono text-white mb-2">2. Execute Tasks Inside Locked Cycles</h3>
              <p className="text-cyan-500/70">
                Break down missions into daily tasks. Work within defined monthly "cycles" with dedicated focus, minimizing scope creep and distractions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
              <img src="/path/to/icon-ship.svg" alt="Ship Icon" className="w-12 h-12 text-cyan-400 mb-4" /> {/* Placeholder */}
              <h3 className="text-2xl font-bold font-mono text-white mb-2">3. Ship and Reset</h3>
              <p className="text-cyan-500/70">
                At the end of each cycle, finalize your deliverables, reflect on progress, and prepare to launch into the next mission with renewed focus.
              </p>
            </div>
          </div>
        </section>

        {/* Roles System Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-6 text-center drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            Team Collaboration & Roles
          </h2>
          <p className="text-lg text-cyan-500/70 text-center mb-8">
            CycleCTL supports collaborative project management with a clear role-based permission system:
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-900/40">
              <h3 className="text-xl font-bold font-mono text-white mb-2">Owner</h3>
              <p className="text-cyan-500/70 text-sm">
                Full control over the project. Can create, edit, delete tasks, manage team members (invite, remove, change roles), and import/export data.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-900/40">
              <h3 className="text-xl font-bold font-mono text-white mb-2">Editor</h3>
              <p className="text-cyan-500/70 text-sm">
                Can create, edit, reorder tasks, and change task statuses. Ideal for team members actively working on missions.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-cyan-500/20 bg-slate-900/40">
              <h3 className="text-xl font-bold font-mono text-white mb-2">Viewer</h3>
              <p className="text-cyan-500/70 text-sm">
                Can view all project tasks and details. Perfect for stakeholders or team members who need to stay informed.
              </p>
            </div>
          </div>
        </section>

        {/* Why CycleCTL Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-6 text-center drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            Why CycleCTL?
          </h2>
          <ul className="list-disc list-inside text-lg text-cyan-500/70 leading-relaxed space-y-3">
            <li>**Discipline Over Motivation:** Our system is built to cultivate consistent execution, not just fleeting inspiration.</li>
            <li>**Clear Objectives:** Break down vague goals into actionable monthly missions with defined deliverables.</li>
            <li>**Focused Execution:** The fixed cycle approach minimizes distractions and encourages deep work.</li>
            <li>**Tangible Outcomes:** Shift from perpetual planning to regularly shipping completed work.</li>
            <li>**Continuous Improvement:** Each cycle offers a chance to review, learn, and refine your approach for the next mission.</li>
            <li>**Team Alignment:** Ensure everyone on your team is aligned with monthly objectives and actively contributing to shipping outcomes.</li>
          </ul>
        </section>

        {/* Tech Stack Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-6 drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            Powered By
          </h2>
          <p className="text-lg md:text-xl text-cyan-500/70 leading-relaxed">
            Built with modern web technologies for a robust, scalable, and intuitive experience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-lg font-mono text-cyan-300">
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">Next.js 14 (App Router)</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">TypeScript</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">React</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">TailwindCSS</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">Framer Motion</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">NextAuth.js</span>
            <span className="px-4 py-2 rounded-lg bg-slate-800/60 border border-cyan-500/20">MongoDB</span>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold font-mono text-cyan-400 mb-6 drop_shadow-[0_0_4px_rgba(0,255,255,0.3)]">
            Open Source
          </h2>
          <p className="text-lg md:text-xl text-cyan-500/70 leading-relaxed mb-6">
            CycleCTL is an open-source project. We welcome contributions, bug reports, and feature requests from the community!
          </p>
          <a
            href="https://github.com/them3chanik/cyclectl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-xl font-bold shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-cyan-400 transition-all"
          >
            <Github className="w-6 h-6" />
            Contribute on GitHub
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 text-center text-sm font-mono text-cyan-600/50 border-t border-cyan-500/10">
        <p>&copy; {new Date().getFullYear()} CycleCTL. All rights reserved.</p>
        <p className="mt-2">Built by <a href="https://them3chanik.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-500">them3chanik</a></p>
        <p className="mt-2 text-xs">Support this project: <a href="https://buymeacoffee.com/them3chanik" target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-500">Buy me a coffee!</a></p>
      </footer>
    </div>
  );
}
