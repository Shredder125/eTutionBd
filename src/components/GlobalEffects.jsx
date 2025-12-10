import React, { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const GlobalEffects = ({ children }) => {
  // --- 1. MOUSE FOLLOWER LOGIC ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX - 16); // -16 to center the 32px cursor
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    // --- 2. SMOOTH SCROLL WRAPPER ---
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      
      {/* --- 3. GLOBAL BACKGROUND (Dark Forever Theme) --- */}
      <div className="fixed inset-0 -z-50 bg-[#000000]">
         {/* The Gradient Animation */}
         <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1e1b4b] to-[#0f172a] animate-dark-gradient opacity-100" />
         {/* Grain & Vignette */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-radial-[circle_at_center_transparent_0%_#000000_100%] opacity-50"></div>
         {/* Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- 4. CUSTOM CURSOR --- */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 bg-indigo-500/30 rounded-full blur-md pointer-events-none z-[9999] mix-blend-screen border border-indigo-400/50"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <div className="absolute inset-0 bg-white/50 rounded-full blur-[2px] transform scale-[0.3]" />
      </motion.div>

      {/* --- YOUR APP CONTENT --- */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Global CSS for Smooth Scroll & Background Animation */}
      <style>{`
        html.lenis {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        @keyframes gradient-xy {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-dark-gradient {
            background-size: 400% 400%;
            animation: gradient-xy 15s ease infinite;
        }
        /* Hide Default Cursor if you want strict custom cursor only */
        /* body { cursor: none; } */
        /* a, button { cursor: pointer; } */
      `}</style>
    </ReactLenis>
  );
};

export default GlobalEffects;