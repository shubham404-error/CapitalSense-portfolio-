"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function Bucks({
  onAction,
  compact = false,
}: {
  onAction: () => void;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "bucks-card bucks-card-compact" : "bucks-card"}>
      <div className="bucks-copy">
        <span className="bucks-kicker">
          <Sparkles size={13} /> MEET BUCKS
        </span>
        <h2>Good habits look good on you.</h2>
        <p>
          I keep the money scene clear, surface one useful move at a time, and
          leave the final call with you.
        </p>
        <button className="bucks-action" onClick={onAction}>
          {compact ? "Ask Bucks" : "Find my starting point"} <ArrowRight size={16} />
        </button>
      </div>
      <div className="bucks-portrait" aria-hidden="true">
        <svg viewBox="0 0 240 220" role="presentation">
          <defs>
            <linearGradient id="bucksBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff8058" />
              <stop offset="1" stopColor="#e53f14" />
            </linearGradient>
            <linearGradient id="bucksGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff7df" stopOpacity=".95" />
              <stop offset="1" stopColor="#ffd7b8" stopOpacity=".25" />
            </linearGradient>
          </defs>
          <path
            className="bucks-glow"
            d="M32 194c18-54 33-97 67-130 30-29 70-38 96-10 27 29 11 73-12 104-25 34-54 47-93 48-28 1-48-3-58-12Z"
            fill="url(#bucksGlow)"
          />
          <path
            className="bucks-body"
            d="M57 184c4-31 10-66 24-95 14-28 37-51 67-48 32 3 48 34 39 66-9 34-38 69-69 86-24 13-49 10-61-9Z"
            fill="url(#bucksBody)"
          />
          <path
            d="M73 157c22 3 52-4 75-22 19-15 34-36 42-55"
            fill="none"
            stroke="#ffb28f"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".72"
          />
          <ellipse cx="112" cy="102" rx="5" ry="7" fill="#2d302b" />
          <ellipse cx="145" cy="98" rx="5" ry="7" fill="#2d302b" />
          <path
            d="M116 120c9 7 18 7 27-1"
            fill="none"
            stroke="#2d302b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="m192 38 4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Z"
            fill="#f4511e"
          />
          <circle cx="51" cy="69" r="5" fill="#8c9b70" />
          <circle cx="207" cy="123" r="4" fill="#8c9b70" />
        </svg>
        <span>Bucks · your money sidekick</span>
      </div>
    </section>
  );
}
