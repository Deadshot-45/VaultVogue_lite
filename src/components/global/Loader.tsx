// "use client";

// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";

// interface LoaderProps {
//   size?: number;
//   text?: string;
//   className?: string;
// }

// export function Loader({ size = 48, text, className }: LoaderProps) {
//   return (
//     <div
//       className={cn(
//         "flex flex-col items-center justify-center gap-4",
//         className,
//       )}
//     >
//       <div
//         style={{ width: size, height: size }}
//         className="relative flex items-center justify-center"
//       >
//         {/* Glow Ring */}
//         <motion.div
//           className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
//           animate={{ scale: [1, 1.4, 1] }}
//           transition={{
//             repeat: Infinity,
//             duration: 2,
//             ease: "easeInOut",
//           }}
//         />

//         {/* Rotating Arc */}
//         <motion.div
//           className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-l-primary"
//           animate={{ rotate: 360 }}
//           transition={{
//             repeat: Infinity,
//             duration: 1,
//             ease: "linear",
//           }}
//         />

//         {/* Outer Pulse Ring */}
//         <motion.div
//           className="absolute inset-0 rounded-full border border-primary/20"
//           animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.2, 0.6] }}
//           transition={{
//             repeat: Infinity,
//             duration: 1.8,
//             ease: "easeInOut",
//           }}
//         />

//         {/* Core Dot */}
//         <motion.div
//           className="w-2.5 h-2.5 rounded-full bg-primary"
//           animate={{
//             scale: [1, 1.4, 1],
//           }}
//           transition={{
//             repeat: Infinity,
//             duration: 1.2,
//             ease: "easeInOut",
//           }}
//         />
//       </div>

//       {text && (
//         <motion.p
//           className="text-sm text-muted-foreground tracking-wide"
//           animate={{
//             opacity: [0.5, 1, 0.5],
//           }}
//           transition={{
//             repeat: Infinity,
//             duration: 1.5,
//             ease: "easeInOut",
//           }}
//         >
//           {text}
//         </motion.p>
//       )}
//     </div>
//   );
// }

"use client";

import "@/App.css";
import { useEffect, useState } from "react";

export function Loader() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vault-vogue-theme") as
      | "light"
      | "dark"
      | null;

    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }

    setMounted(true);
  }, []);

  // Sync to localStorage + DOM
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("vault-vogue-theme", theme);
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme, mounted]);

  return (
    <>
      <div className={theme === "light" ? "light" : "dark"}>
        {/* Mode Toggle */}
        <div
          className="mode-toggle"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          title="Toggle light/dark mode"
        >
          <svg
            className="icon-moon"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 8.5A6 6 0 0 1 4.5 1.5a5.5 5.5 0 1 0 7 7z"
              stroke="#d4b796"
              strokeWidth="0.8"
              fill="none"
              strokeLinejoin="round"
            />
          </svg>
          <div className="toggle-track">
            <div className="toggle-thumb"></div>
          </div>
          <svg
            className="icon-sun"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="2.5"
              stroke="#8a6a42"
              strokeWidth="0.8"
            />
            <line
              x1="6.5"
              y1="0.5"
              x2="6.5"
              y2="2"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="6.5"
              y1="11"
              x2="6.5"
              y2="12.5"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="0.5"
              y1="6.5"
              x2="2"
              y2="6.5"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="11"
              y1="6.5"
              x2="12.5"
              y2="6.5"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="2.4"
              y1="2.4"
              x2="3.45"
              y2="3.45"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="9.55"
              y1="9.55"
              x2="10.6"
              y2="10.6"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="10.6"
              y1="2.4"
              x2="9.55"
              y2="3.45"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <line
              x1="3.45"
              y1="9.55"
              x2="2.4"
              y2="10.6"
              stroke="#8a6a42"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="loader-scene">
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>

          <div className="glow-ring"></div>

          <div
            className="particle"
            style={{
              left: 60,
              top: 200,
              animationDuration: "5s",
              animationDelay: "0s",
            }}
          ></div>
          <div
            className="particle"
            style={{
              left: 390,
              top: 260,
              animationDuration: "7s",
              animationDelay: "1.5s",
            }}
          ></div>
          <div
            className="particle"
            style={{
              left: 120,
              top: 300,
              animationDuration: "6s",
              animationDelay: "3s",
            }}
          ></div>
          <div
            className="particle"
            style={{
              left: 350,
              top: 180,
              animationDuration: "4.5s",
              animationDelay: "0.8s",
            }}
          ></div>
          <div
            className="particle"
            style={{
              left: 200,
              top: 380,
              animationDuration: "8s",
              animationDelay: "2s",
            }}
          ></div>
          <div
            className="particle"
            style={{
              left: 310,
              top: 340,
              animationDuration: "5.5s",
              animationDelay: "4s",
            }}
          ></div>

          <div className="hanger-wrap">
            <div className="orbit-ring-outer"></div>
            <div className="orbit-ring"></div>
            <svg
              className="hanger-svg"
              viewBox="0 0 100 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 6 C50 6 50 0 44 0 C38 0 36 5 36 8 C36 12 40 14 44 14"
                stroke="var(--gold)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M50 14 C50 14 50 28 26 40 L6 52"
                stroke="var(--gold)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M50 14 C50 14 50 28 74 40 L94 52"
                stroke="var(--gold)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <line
                x1="6"
                y1="52"
                x2="94"
                y2="52"
                stroke="var(--gold)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="6" cy="52" r="2.5" fill="var(--gold)" opacity="0.6" />
              <circle
                cx="94"
                cy="52"
                r="2.5"
                fill="var(--gold)"
                opacity="0.6"
              />
              <line
                x1="6"
                y1="58"
                x2="94"
                y2="58"
                stroke="var(--gold-faint)"
                strokeWidth="0.5"
              />
              <circle cx="50" cy="14" r="2" fill="var(--gold-soft)" />
            </svg>
          </div>

          <div className="brand-dash">
            <span className="text-[color:var(--brand-text)]">VAULT</span>
            <div className="dash-line"></div>
            <span>VOGUE</span>
          </div>

          <p className="text-[color:var(--slogan-text)] w-80 text-center">
            Premium fashion curated for
            <br />
            modern lifestyles
          </p>

          <div className="progress-container">
            <div className="progress-track">
              <div className="progress-fill"></div>
            </div>
            <p className="text-[color:var(--progress-label)] ">
              Curating your collection
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
