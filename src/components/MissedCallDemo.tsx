"use client";

import { useState, useRef } from "react";

export default function MissedCallDemo() {
  const [stage, setStage] = useState<"idle" | "ringing" | "texted" | "replied">("idle");
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  function clearTimers() {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  }

  function playSequence() {
    clearTimers();
    setStage("ringing");
    timeouts.current.push(
      setTimeout(() => setStage("texted"), 1200),
      setTimeout(() => setStage("replied"), 2400)
    );
  }

  function resetSequence() {
    clearTimers();
    setStage("idle");
  }

  return (
    <div
      onMouseEnter={playSequence}
      onMouseLeave={resetSequence}
      onFocus={playSequence}
      onBlur={resetSequence}
      tabIndex={0}
      className="bg-gray-900 rounded-2xl p-7 motion-reduce:cursor-default cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      aria-label="Demo: hover to see a missed call automatically trigger a text message"
    >
      <div className="bg-white rounded-xl p-4 max-w-xs mx-auto min-h-[320px] flex flex-col justify-end relative overflow-hidden">
        <div
          className={`flex items-center gap-2.5 px-3 py-2.5 bg-orange-50 rounded-lg mb-2.5 transition-opacity duration-500 motion-reduce:opacity-100 ${
            stage === "idle" ? "opacity-0" : stage === "ringing" ? "opacity-100" : "opacity-40"
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-orange-700 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-900 m-0">Missed call</p>
            <p className="text-[11px] text-orange-700 m-0">(715) 555-0148 · just now</p>
          </div>
        </div>

        <div
          className={`transition-all duration-500 motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            stage === "texted" || stage === "replied"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          <div className="bg-emerald-700 text-emerald-50 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-[13px] leading-relaxed max-w-[90%]">
            Hi, this is Anderson Garage Doors. Sorry we missed your call — how can we help? Reply here and we&apos;ll get right back to you.
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 ml-1">
            Delivered · 2 sec after the missed call
          </p>
        </div>

        <div
          className={`mt-2.5 flex justify-end transition-all duration-500 motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            stage === "replied" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="bg-gray-100 text-gray-900 px-3.5 py-2.5 rounded-2xl rounded-br-sm text-[13px] max-w-[80%]">
            Spring snapped, need someone today if possible
          </div>
        </div>

        {stage === "idle" && (
          <p className="text-center text-xs text-gray-400 motion-reduce:hidden">
            Hover to see it happen
          </p>
        )}
      </div>
    </div>
  );
}
