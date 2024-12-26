'use client'

import React from "react";
import { motion } from "framer-motion";

export function WavyBackgroundDemo() {
  return (
    <div className="h-[90vh] bg-black flex items-center justify-center relative overflow-hidden">
      {/* Orbital ring */}
      <motion.div
        className="absolute w-[380px] h-[380px] md:w-[580px] md:h-[580px] lg:w-[880px] lg:h-[880px] border-[0.25px] md:border-[2px] border-white/10 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Orbiting circle */}
      <motion.div
        className="absolute w-[380px] h-[380px] md:w-[580px] md:h-[580px] lg:w-[880px] lg:h-[880px]"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-0 left-1/2 w-0.5 h-0.5 md:w-0.5 md:h-0.5 lg:w-1 lg:h-1 bg-white/30 rounded-full transform -translate-x-1/2" />
      </motion.div>

      {/* Central text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-white text-4xl md:text-5xl lg:text-6xl font-light tracking-widest relative z-10"
      >
        hello
      </motion.div>
    </div>
  );
}