"use client";

import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  // Renamed to HomePage
  const { data: session, status } = useSession();
  const router = useRouter(); // Import useRouter

  // Redirect authenticated users to /projects
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/projects");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Rocket className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-cyan-400 font-mono text-sm">LOADING AUTH...</p>
        </div>
      </div>
    );
  }

  // Only show login UI if not authenticated
  if (status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="w-16 h-16 text-cyan-400" />
          </motion.div>
          <h1 className="text-4xl font-bold font-mono text-cyan-400 tracking-wider">
            CYCLECTL
          </h1>
          <p className="text-lg font-mono text-cyan-500/60">
            Control the cycle. Ship the outcome.

          </p>
          <div className="flex gap-4 mt-8">
            <Button onClick={() => signIn("github")}>
              Sign in with GitHub
            </Button>
            <Button onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Should redirect if authenticated
}
