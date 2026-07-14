"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeUp, SlideLeft, SlideRight, FadeIn, ScaleIn } from "./animations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type LoadChartItem = {
  outreach: string;
  capacity: string;
};

type DetailLoadChartProps = {
  loadChartTitle: string;
  loadChartDesc: string;
  outreachCol: string;
  capacityCol: string;
  loadChart: readonly LoadChartItem[];
  isRtl: boolean;
  loadEnvelope: string;
  capacityUpper: string;
  outreachUpper: string;
  gridLabel: string;
};

// Parse numeric value from strings like "3200 kg" → 3200
function parseNum(s: string) {
  return parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
}

// ────────────────────────────────────────────────────────────
// Load Curve SVG — classic crane capacity envelope chart
// ────────────────────────────────────────────────────────────
function LoadCurve({ loadChart, loadEnvelope, capacityUpper, outreachUpper, gridLabel }: { loadChart: readonly LoadChartItem[], loadEnvelope: string, capacityUpper: string, outreachUpper: string, gridLabel: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const W = 400;
  const H = 260;
  const padL = 54;
  const padR = 24;
  const padT = 20;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const reaches = loadChart.map((r) => parseNum(r.outreach));
  const caps = loadChart.map((r) => parseNum(r.capacity));
  const minReach = Math.min(...reaches);
  const maxReach = Math.max(...reaches);
  const maxCap = Math.max(...caps);

  const toX = (v: number) =>
    padL + ((v - minReach) / (maxReach - minReach || 1)) * chartW;
  const toY = (v: number) =>
    padT + chartH - (v / (maxCap || 1)) * chartH;

  const points = loadChart.map((r) => ({
    x: toX(parseNum(r.outreach)),
    y: toY(parseNum(r.capacity)),
    raw: r,
  }));

  // SVG path for the curve
  const linePath =
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

  // Area fill path (close down to bottom)
  const areaPath =
    linePath +
    ` L ${points[points.length - 1]!.x.toFixed(1)} ${(padT + chartH).toFixed(1)}` +
    ` L ${points[0]!.x.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  // Y-axis gridlines (4 lines)
  const yTicks = 4;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid lines */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = padT + (chartH / yTicks) * i;
        const capVal = maxCap - (maxCap / yTicks) * i;
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="rgba(59,130,246,0.08)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text
              x={padL - 6}
              y={y + 4}
              textAnchor="end"
              fontSize={8}
              fontFamily="monospace"
              fill="rgba(148,163,184,0.5)"
            >
              {capVal >= 1000
                ? `${(capVal / 1000).toFixed(1)}t`
                : `${Math.round(capVal)}kg`}
            </text>
          </g>
        );
      })}

      {/* X-axis gridlines */}
      {points.map((p, i) => (
        <line
          key={`xg-${i}`}
          x1={p.x}
          y1={padT}
          x2={p.x}
          y2={padT + chartH}
          stroke="rgba(59,130,246,0.06)"
          strokeWidth={1}
        />
      ))}

      {/* X-axis */}
      <line
        x1={padL}
        y1={padT + chartH}
        x2={W - padR}
        y2={padT + chartH}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />

      {/* Y-axis */}
      <line
        x1={padL}
        y1={padT}
        x2={padL}
        y2={padT + chartH}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />

      {/* Area fill — animated */}
      <motion.path
        d={areaPath}
        fill="url(#curveGrad)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
      />

      {/* Gradient def */}
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(212,175,55,0.25)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.0)" />
        </linearGradient>
      </defs>

      {/* Curve line — animated draw */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="rgba(212,175,55,0.9)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={`dp-${i}`}>
          {/* Vertical drop */}
          <motion.line
            x1={p.x}
            y1={p.y}
            x2={p.x}
            y2={padT + chartH}
            stroke="rgba(212,175,55,0.15)"
            strokeWidth={1}
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 + i * 0.1 }}
          />
          {/* Point circle */}
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#070b14"
            stroke="rgba(212,175,55,0.9)"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
          />
          {/* X label */}
          <motion.text
            x={p.x}
            y={padT + chartH + 14}
            textAnchor="middle"
            fontSize={8}
            fontFamily="monospace"
            fill="rgba(148,163,184,0.5)"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 + i * 0.1 }}
          >
            {p.raw.outreach}
          </motion.text>
        </g>
      ))}

      {/* Axis labels */}
      <text
        x={W / 2}
        y={H - 2}
        textAnchor="middle"
        fontSize={7.5}
        fontFamily="monospace"
        fill="rgba(100,116,139,0.7)"
      >
        {outreachUpper}
      </text>
      <text
        x={10}
        y={padT + chartH / 2}
        textAnchor="middle"
        fontSize={7.5}
        fontFamily="monospace"
        fill="rgba(100,116,139,0.7)"
        transform={`rotate(-90, 10, ${padT + chartH / 2})`}
      >
        {capacityUpper}
      </text>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────
export default function DetailLoadChart({
  loadChartTitle,
  loadChartDesc,
  outreachCol,
  capacityCol,
  loadChart,
  isRtl,
  loadEnvelope,
  capacityUpper,
  outreachUpper,
  gridLabel,
}: DetailLoadChartProps) {
  if (!loadChart || loadChart.length === 0) return null;

  const caps = loadChart.map((r) => parseNum(r.capacity));
  const maxCap = Math.max(...caps);

  return (
    <section id="section-capacity" className="relative py-24 mb-8">
      {/* Section separator */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-[10px] font-mono tracking-widest text-cta uppercase">{loadEnvelope}</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </FadeIn>

      {/* Header */}
      <FadeUp delay={0.1}>
        <div className={`flex items-center gap-3 mb-4 ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
          <ScaleIn delay={0.15}>
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-mono text-blue-400">03</span>
            </div>
          </ScaleIn>
          <span className="text-[10px] font-mono tracking-[0.35em] text-blue-400/70 uppercase">{loadChartTitle}</span>
        </div>
        <p className={`text-slate-500 text-sm mb-12 max-w-xl ${isRtl ? "text-right ml-auto" : ""}`}>{loadChartDesc}</p>
      </FadeUp>

      {/* Main panel */}
      <div className="rounded-3xl border border-white/[0.06] bg-[#0c1220]/80 backdrop-blur-sm overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white/[0.02] border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
            </div>
            <span className="ml-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">load_chart.json</span>
          </div>
          <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">FEM 1.001 · EN 13001</span>
        </div>

        {/* Two columns */}
        <div className={`grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05] ${isRtl ? "direction-rtl" : ""}`}>

          {/* LEFT: Data rows */}
          <SlideLeft delay={0.2}>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="w-[100px] text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">{outreachCol}</TableHead>
                    <TableHead className="text-[9px] font-bold uppercase tracking-[0.25em] text-cta/70">{capacityCol}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {loadChart.map((row, index) => {
                  const capVal = parseNum(row.capacity);
                  const pct = maxCap > 0 ? (capVal / maxCap) * 100 : 0;
                  return (
                    <TableRow key={index} className="border-white/5 hover:bg-white/[0.02] transition-colors relative group">
                      <TableCell className="font-mono text-sm text-slate-400 group-hover:text-slate-200 transition-colors py-4 px-2">
                        <span className="text-[9px] font-mono text-slate-700 w-4 inline-block mr-3">{String(index + 1).padStart(2, "0")}</span>
                        {row.outreach}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="relative flex flex-col gap-1.5">
                          <span className="font-black text-xl text-cta group-hover:text-white transition-colors leading-none">
                            {row.capacity}
                          </span>
                          <div className="h-[2px] w-full max-w-[120px] bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-cta to-cta/50 rounded-full"
                              initial={{ width: "0%" }}
                              whileInView={{ width: `${pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

              {/* FEM note */}
              <div className="px-6 py-3.5 border-t border-white/[0.04]">
                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-wider">
                  ISO 4301 — Marine Grade Certified
                </p>
              </div>
          </SlideLeft>

          {/* RIGHT: Load curve chart */}
          <SlideRight delay={0.25}>
            <div className="p-6 flex flex-col h-full min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-mono text-slate-700 uppercase tracking-wider">Load Envelope Curve</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-[2px] bg-cta" />
                    <span className="text-[8px] font-mono text-slate-600">Capacity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-[1px] border-t border-dashed border-slate-700" />
                    <span className="text-[8px] font-mono text-slate-600">{gridLabel}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <LoadCurve loadChart={loadChart} loadEnvelope={loadEnvelope} capacityUpper={capacityUpper} outreachUpper={outreachUpper} gridLabel={gridLabel} />
              </div>
            </div>
          </SlideRight>
        </div>
      </div>
    </section>
  );
}
