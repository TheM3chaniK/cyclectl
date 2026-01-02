"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clipboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Portal } from "./Portal";

const EXAMPLE_JSON = `[
  {
    "task_title": "Design the new landing page",
    "task_description": "Create wireframes, mockups, and prototypes for the new landing page.",
    "start": "2026-01-10",
    "end": "2026-01-20",
    "status": "in_progress",
    "month": "January",
    "year": 2026
  },
  {
    "task_title": "Develop the new API",
    "task_description": "Implement the backend API endpoints for user authentication and task management.",
    "start": "2026-01-15",
    "end": "2026-02-10",
    "status": "pending",
    "month": "January",
    "year": 2026
  }
]`;

interface JsonUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  projectName: string;
}

export function JsonUploadModal({ isOpen, onClose, onUploadSuccess, projectName }: JsonUploadModalProps) {
  const [jsonInput, setJsonInput] = useState(EXAMPLE_JSON);
  const [loading, setLoading] = useState(false);

  const handleLoadJson = async () => {
    if (!jsonInput.trim()) {
      toast.error("Please paste JSON data into the textarea.");
      return;
    }

    setLoading(true);

    try {
      const parsedJson = JSON.parse(jsonInput);

      const response = await fetch(`/api/tasks/upload?project=${projectName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import tasks.");
      }

      toast.success("Tasks imported successfully!");
      onUploadSuccess(); // Call the callback
      setJsonInput(EXAMPLE_JSON); // Reset to example after successful upload
      onClose(); // Close modal after successful upload
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCopyExample = () => {
    navigator.clipboard.writeText(jsonInput); // Copy current content, not just example
    toast.info("JSON copied to clipboard!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 z-[999] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-xl shadow-2xl shadow-cyan-500/20"
            >
              <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
                <h2 className="text-xl font-mono font-bold text-cyan-400">
                  LOAD JSON TASKS
                </h2>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={handleCopyExample}
                    className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
                    title="Copy JSON to clipboard"
                  >
                    <Clipboard className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-cyan-500/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <Textarea
                  placeholder="Paste your JSON task data here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none placeholder:text-cyan-500/30"
                />
                <Button
                  onClick={handleLoadJson}
                  disabled={loading || !jsonInput.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-mono text-sm font-bold hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  {loading ? "Loading..." : "Load JSON"}
                </Button>
              </div>
            </motion.div>
          </div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
