"use client";

import { motion } from "framer-motion";
import React from "react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({
  children,
}: Readonly<DashboardShellProps>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen"
    >
      <main className="w-full py-8">
        <div className="flex flex-col gap-10">{children}</div>
      </main>
    </motion.div>
  );
}
