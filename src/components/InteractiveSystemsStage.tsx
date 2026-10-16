"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import {
  Cpu,
  Layers,
  Database,
  Sliders,
  Code2,
  Box,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NodeId = "cpp" | "react" | "postgres";
type ViewMode = "stage" | "code";

export function InteractiveSystemsStage() {
  const [activeNode, setActiveNode] = useState<NodeId>("cpp");
  const [viewMode, setViewMode] = useState<ViewMode>("stage");
  const [codeTab, setCodeTab] = useState<"cpp" | "ts">("cpp");
  const [opsRate, setOpsRate] = useState<number>(2400); // 100 to 10,000 ops/s
  const [liveCounter, setLiveCounter] = useState<number>(104820);
  const containerRef = useRef<HTMLDivElement>(null);

  const shouldReduceMotion = useReducedMotion();

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 24 };
  const rotateX = useSpring(mouseY, springConfig);
  const rotateY = useSpring(mouseX, springConfig);

  // Dynamic simulation tick (pauses when user prefers reduced motion)
  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setLiveCounter((prev) => prev + Math.floor(opsRate / 20));
    }, 50);
    return () => clearInterval(interval);
  }, [opsRate, shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;

    // Subtle tilt: max +/- 6 degrees
    mouseX.set((x / (width / 2)) * 6);
    mouseY.set((-y / (height / 2)) * 6);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const latencySim = (1200 / opsRate).toFixed(2);
  const memoryAllocSim = (32.4 + (opsRate / 1000) * 1.8).toFixed(1);

  return (
    <div className="w-full relative select-none">
      {/* Console frame */}
      <div className="rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-panel)] overflow-hidden shadow-2xl surface-elevation">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-status-live)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-status-live)]" />
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[var(--color-text)] font-semibold">
              SYS.INTERACTIVE //
            </span>
            <span className="text-[10px] text-[var(--color-text-dim)] hidden sm:inline">
              PERSPECTIVA 3D
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="live" className="text-[9px] py-0 px-1.5">
              SIMULACIÓN
            </Badge>

            {/* Stage / Code View Switcher */}
            <div className="flex items-center bg-black/40 rounded-[4px] p-0.5 border border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => setViewMode("stage")}
                className={`flex items-center gap-1 px-2 py-1 rounded-[3px] text-[10px] font-mono uppercase tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                  viewMode === "stage"
                    ? "bg-[var(--color-accent)] text-white font-medium"
                    : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                }`}
              >
                <Box className="w-3 h-3" strokeWidth={1.5} />
                Stage 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`flex items-center gap-1 px-2 py-1 rounded-[3px] text-[10px] font-mono uppercase tracking-wider transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                  viewMode === "code"
                    ? "bg-[var(--color-accent)] text-white font-medium"
                    : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                }`}
              >
                <Code2 className="w-3 h-3" strokeWidth={1.5} />
                Código Fuente
              </button>
            </div>
          </div>
        </div>

        {/* Node Tabs */}
        <div className="grid grid-cols-3 border-b border-[var(--color-border)] bg-[var(--color-panel)] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveNode("cpp")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 border-r border-[var(--color-border)] transition-all cursor-pointer ${
              activeNode === "cpp"
                ? "bg-white/[0.04] text-[var(--color-accent-bright)] border-b-2 border-b-[var(--color-accent)] font-semibold"
                : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.01]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="truncate">0x01 C/C++</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNode("react")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 border-r border-[var(--color-border)] transition-all cursor-pointer ${
              activeNode === "react"
                ? "bg-white/[0.04] text-[var(--color-telemetry)] border-b-2 border-b-[var(--color-telemetry)] font-semibold"
                : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.01]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="truncate">0x02 React/Vite</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNode("postgres")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 transition-all cursor-pointer ${
              activeNode === "postgres"
                ? "bg-white/[0.04] text-[var(--color-status-live)] border-b-2 border-b-[var(--color-status-live)] font-semibold"
                : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.01]"
            }`}
          >
            <Database className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="truncate">0x03 Postgres</span>
          </button>
        </div>

        {/* Main Interactive Stage Body */}
        <div className="p-4 sm:p-6 min-h-[340px] flex flex-col justify-between relative bg-radial from-white/[0.02] to-transparent">
          {viewMode === "stage" ? (
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-[260px] sm:h-[280px] rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)]/60 blueprint-grid flex items-center justify-center overflow-hidden [perspective:1200px]"
            >
              {/* 3D Transform Container */}
              <motion.div
                style={{
                  rotateX: shouldReduceMotion ? 0 : rotateX,
                  rotateY: shouldReduceMotion ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-[340px] h-[200px] flex items-center justify-center transition-transform duration-75"
              >
                {/* Plane 1: Native Base Layer (Z: 0px) */}
                <div
                  style={{ transform: "translateZ(0px)" }}
                  className="absolute inset-0 rounded-[6px] border border-[var(--color-border-strong)] bg-black/40 p-4 flex flex-col justify-between backdrop-blur-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-faint)]">
                    <span>LAYER_00 // HARDWARE & OS</span>
                    <span>MEM_OFFSET: 0x7FFF00</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 py-2">
                    {[1, 2, 3, 4].map((block) => (
                      <div
                        key={block}
                        className="h-8 rounded-[3px] bg-white/[0.03] border border-[var(--color-border)] flex items-center justify-center text-[9px] font-mono text-[var(--color-text-faint)]"
                      >
                        0x0{block}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--color-text-dim)] flex justify-between">
                    <span>Virtual Memory Map</span>
                    <span className="text-[var(--color-status-live)]">Allocated: OK</span>
                  </div>
                </div>

                {/* Plane 2: Runtime Execution Layer (Z: 28px) */}
                <div
                  style={{ transform: "translateZ(28px)" }}
                  className="absolute inset-x-3 inset-y-3 rounded-[6px] border border-[var(--color-border-strong)] bg-[var(--color-panel)]/80 p-3.5 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-[var(--color-text)]">
                      {activeNode === "cpp" && "C/C++ Memory Allocator"}
                      {activeNode === "react" && "React 19 Fiber Reconciliation"}
                      {activeNode === "postgres" && "PostgreSQL B-Tree Index"}
                    </span>
                    <Badge variant={activeNode === "cpp" ? "accent" : activeNode === "react" ? "telemetry" : "live"}>
                      {activeNode === "cpp" ? "NATIVO" : activeNode === "react" ? "VIRTUAL DOM" : "ACID RELACIONAL"}
                    </Badge>
                  </div>

                  {activeNode === "cpp" && (
                    <div className="space-y-1.5 text-[11px] font-mono text-[var(--color-text-dim)]">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>Stack Pointer:</span>
                        <span className="text-[var(--color-accent-bright)] font-semibold">0x7ffee4b2</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>Heap Chunk size:</span>
                        <span className="tnum">1,024 bytes (Aligned 8B)</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--color-text-faint)]">
                        <span>Valgrind Check:</span>
                        <span className="text-[var(--color-status-live)]">0 Leaks [Simulado]</span>
                      </div>
                    </div>
                  )}

                  {activeNode === "react" && (
                    <div className="space-y-1.5 text-[11px] font-mono text-[var(--color-text-dim)]">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>State Engine:</span>
                        <span className="text-[var(--color-telemetry)] font-semibold">Zustand Store</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>Vite Bundler:</span>
                        <span className="tnum">Native ESM HMR (&lt;10ms)</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--color-text-faint)]">
                        <span>Commit Phase:</span>
                        <span className="text-[var(--color-status-live)]">Concurrent Root OK</span>
                      </div>
                    </div>
                  )}

                  {activeNode === "postgres" && (
                    <div className="space-y-1.5 text-[11px] font-mono text-[var(--color-text-dim)]">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>Prisma Connection Pool:</span>
                        <span className="text-[var(--color-status-live)] font-semibold">10 Conexiones activas</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-1">
                        <span>Query Plan:</span>
                        <span className="tnum">Index Scan on &apos;slug&apos; (O(log N))</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-[var(--color-text-faint)]">
                        <span>Transaction Mode:</span>
                        <span className="text-[var(--color-telemetry)]">SERIALIZABLE</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Plane 3: Live Pulse Node (Z: 56px) */}
                <div
                  style={{ transform: "translateZ(56px)" }}
                  className="absolute right-4 bottom-4 pointer-events-none"
                >
                  <div className="px-2.5 py-1 rounded-[4px] bg-black/90 border border-[var(--color-border-strong)] text-[10px] font-mono text-[var(--color-text)] shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    <span className="tnum">{opsRate.toLocaleString()} ops/s</span>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Source Code View with Cognitive Easter Egg */
            <div className="rounded-[6px] border border-[var(--color-border)] bg-black/60 overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-panel-2)] border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCodeTab("cpp")}
                    className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer ${
                      codeTab === "cpp"
                        ? "bg-white/10 text-[var(--color-text)] font-semibold"
                        : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    migol_core.cpp
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeTab("ts")}
                    className={`px-2 py-0.5 rounded-[3px] text-[11px] transition-colors cursor-pointer ${
                      codeTab === "ts"
                        ? "bg-white/10 text-[var(--color-text)] font-semibold"
                        : "text-[var(--color-text-faint)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    useFinanceStore.ts
                  </button>
                </div>
                <span className="text-[10px] text-[var(--color-text-faint)]">UTF-8 // LF</span>
              </div>

              <div className="p-4 max-h-[220px] overflow-y-auto leading-relaxed text-[11px]">
                {codeTab === "cpp" ? (
                  <pre className="text-[var(--color-text-dim)]">
                    <span className="text-[var(--color-accent-bright)]">#include</span> &lt;iostream&gt;{"\n"}
                    <span className="text-[var(--color-accent-bright)]">#include</span> &lt;string_view&gt;{"\n\n"}
                    <span className="text-[var(--color-telemetry)]">struct</span> <span className="text-[var(--color-text)]">DeveloperProfile</span> &#123;{"\n"}
                    {"  "}std::string_view name = <span className="text-[var(--color-status-live)]">&quot;Miguel Garcia (MIGOL)&quot;</span>;{"\n"}
                    {"  "}std::string_view core = <span className="text-[var(--color-status-live)]">&quot;C/C++ &amp; Full Stack Web&quot;</span>;{"\n"}
                    {"  "}<span className="text-[var(--color-text-faint)]">{"// Easter egg: Matriz cognitiva de ingeniería"}</span>{"\n"}
                    {"  "}std::string_view cognitive = <span className="text-[var(--color-status-live)]">&quot;INFP · SO/SX · 9w1 · 946&quot;</span>;{"\n"}
                    &#125;;{"\n\n"}
                    <span className="text-[var(--color-telemetry)]">template</span>&lt;<span className="text-[var(--color-telemetry)]">typename</span> Allocator&gt;{"\n"}
                    <span className="text-[var(--color-telemetry)]">class</span> <span className="text-[var(--color-text)]">MemoryArena</span> &#123;{"\n"}
                    {"  "}uint8_t* buffer_ = <span className="text-[var(--color-accent)]">nullptr</span>;{"\n"}
                    {"  "}size_t capacity_ = <span className="tnum">1024</span> * <span className="tnum">1024</span>; <span className="text-[var(--color-text-faint)]">{"// 1 MB Arena"}</span>{"\n"}
                    &#125;;
                  </pre>
                ) : (
                  <pre className="text-[var(--color-text-dim)]">
                    <span className="text-[var(--color-accent-bright)]">import</span> &#123; create &#125; <span className="text-[var(--color-accent-bright)]">from</span> <span className="text-[var(--color-status-live)]">&quot;zustand&quot;</span>;{"\n"}
                    <span className="text-[var(--color-accent-bright)]">import</span> type &#123; Transaction &#125; <span className="text-[var(--color-accent-bright)]">from</span> <span className="text-[var(--color-status-live)]">&quot;@/types&quot;</span>;{"\n\n"}
                    <span className="text-[var(--color-telemetry)]">interface</span> <span className="text-[var(--color-text)]">FinanceState</span> &#123;{"\n"}
                    {"  "}balance: number;{"\n"}
                    {"  "}records: Transaction[];{"\n"}
                    {"  "}addEntry: (t: Transaction) =&gt; void;{"\n"}
                    &#125;;{"\n\n"}
                    <span className="text-[var(--color-telemetry)]">export const</span> <span className="text-[var(--color-text)]">useFinanceStore</span> = create&lt;FinanceState&gt;((set) =&gt; (&#123;{"\n"}
                    {"  "}balance: <span className="tnum">18492.40</span>,{"\n"}
                    {"  "}records: [],{"\n"}
                    {"  "}addEntry: (t) =&gt; set((s) =&gt; (&#123; records: [t, ...s.records] &#125;)),{"\n"}
                    &#125;));
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* Interactive Load Slider & Telemetry Metrics */}
          <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
                  Frecuencia de Carga (Simulada):
                </span>
                <span className="text-[var(--color-text)] font-semibold tnum">
                  {opsRate.toLocaleString()} ops/s
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={opsRate}
                onChange={(e) => setOpsRate(Number(e.target.value))}
                className="w-full h-1 bg-[var(--color-panel-2)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                aria-label="Frecuencia de carga simulada"
              />
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono shrink-0">
              <div className="flex flex-col">
                <span className="text-[var(--color-text-faint)]">Latencia media</span>
                <span className="text-[var(--color-telemetry)] font-semibold tnum">{latencySim} ms</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--color-text-faint)]">Memoria virtual</span>
                <span className="text-[var(--color-text)] font-semibold tnum">{memoryAllocSim} MB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[var(--color-text-faint)]">Ops procesadas</span>
                <span className="text-[var(--color-status-live)] font-semibold tnum">
                  {liveCounter.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
