'use client'
import { Github, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSearchParams } from 'next/navigation'
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/projects";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent z-0" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-full max-w-md p-8 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 space-y-6"
      >
        <div className="flex flex-col items-center space-y-4">
          <Rocket className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]" />
          <h1 className="text-3xl font-bold font-mono text-cyan-400 tracking-wider">
            CYCLECTL
          </h1>
          <p className="text-md font-mono text-cyan-500/70 text-center">
            Sign in to control your execution cycle.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => signIn("github", { callbackUrl })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm font-bold hover:bg-cyan-500/10 transition-all"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </Button>

          <Button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm font-bold hover:bg-cyan-500/10 transition-all"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
