"use client"

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
        style={{ background: 'var(--gold-faint)', border: '1px solid var(--gold-soft)' }}
      >
        <Settings className="h-8 w-8" style={{ color: 'var(--gold)' }} />
      </div>
      <h2
        className="font-cormorant text-3xl font-light"
        style={{ color: 'var(--brand-text)' }}
      >
        Settings
      </h2>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Admin settings panel is coming soon. This section will include branding,
        notification preferences, and system configurations.
      </p>
      <span className="mt-6 badge badge-gold">Coming Soon</span>
    </motion.div>
  );
}
