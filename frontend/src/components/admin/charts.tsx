import React from 'react';

/**
 * Dependency-free SVG chart primitives for the admin console.
 * Styled to the app palette (#0F1B29 ink, #DDDDDD rules, #F3F4F5 wash).
 */

export interface Slice {
  label: string;
  value: number;
  color: string;
}

/** Donut chart with a centered total and a side legend. */
export function DonutChart({ slices, title, subtitle }: { slices: Slice[]; title: string; subtitle?: string }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5 p-4 rounded-2xl border border-[#DDDDDD] bg-white">
      <svg viewBox="0 0 120 120" className="w-28 h-28 shrink-0 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F5" strokeWidth="14" />
        {total > 0 &&
          slices
            .filter((slice) => slice.value > 0)
            .map((slice) => {
              const fraction = slice.value / total;
              const dash = fraction * circumference;
              const element = (
                <circle
                  key={slice.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="14"
                  strokeDasharray={`${Math.max(dash - 1.5, 0.5)} ${circumference}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                >
                  <title>{`${slice.label}: ${slice.value}`}</title>
                </circle>
              );
              offset += dash;
              return element;
            })}
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-[#0F1B29]">{title}</p>
        {subtitle && <p className="text-[11px] text-[#747F8D] mb-2">{subtitle}</p>}
        <div className="space-y-1.5 mt-1">
          {slices.map((slice) => (
            <div key={slice.label} className="flex items-center gap-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: slice.color }} />
              <span className="text-[#747F8D] flex-1 truncate">{slice.label}</span>
              <span className="font-bold text-[#0F1B29] tabular-nums">{slice.value}</span>
              <span className="text-[#747F8D] tabular-nums w-10 text-right">
                {total > 0 ? `${Math.round((slice.value / total) * 100)}%` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface BarRow {
  label: string;
  value: number;
  /** Optional stacked second segment (e.g. severe subset). */
  secondary?: number;
}

/** Horizontal bar chart, value-sorted, with a stacked "severe" segment. */
export function HBarChart({ rows, title, subtitle, maxRows = 8 }: { rows: BarRow[]; title: string; subtitle?: string; maxRows?: number }) {
  const visible = [...rows].sort((a, b) => b.value - a.value).slice(0, maxRows);
  const max = Math.max(...visible.map((row) => row.value), 1);

  return (
    <div className="p-4 rounded-2xl border border-[#DDDDDD] bg-white">
      <p className="text-xs font-bold text-[#0F1B29]">{title}</p>
      {subtitle && <p className="text-[11px] text-[#747F8D] mb-3">{subtitle}</p>}
      <div className="space-y-2 mt-2">
        {visible.length === 0 && <p className="text-[11px] text-[#747F8D]">No data yet.</p>}
        {visible.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#0F1B29] w-28 truncate text-right" title={row.label}>
              {row.label}
            </span>
            <div className="flex-1 h-4 rounded-lg bg-[#F3F4F5] overflow-hidden flex">
              <div
                className="h-full bg-[#0F1B29] rounded-l-lg transition-all"
                style={{ width: `${(row.value / max) * 100}%` }}
                title={`${row.label}: ${row.value}`}
              />
              {typeof row.secondary === 'number' && row.secondary > 0 && (
                <div
                  className="h-full bg-rose-600 transition-all"
                  style={{ width: `${(row.secondary / max) * 100}%` }}
                  title={`${row.label}: ${row.secondary} severe`}
                />
              )}
            </div>
            <span className="text-[11px] font-bold text-[#0F1B29] tabular-nums w-8 text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

/** Funnel: proportional stacked rows from top (widest) to bottom. */
export function FunnelChart({ steps, title, subtitle }: { steps: FunnelStep[]; title: string; subtitle?: string }) {
  const max = Math.max(...steps.map((step) => step.value), 1);
  return (
    <div className="p-4 rounded-2xl border border-[#DDDDDD] bg-white">
      <p className="text-xs font-bold text-[#0F1B29]">{title}</p>
      {subtitle && <p className="text-[11px] text-[#747F8D] mb-3">{subtitle}</p>}
      <div className="space-y-2 mt-2">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-[#0F1B29] w-28 truncate text-right">{step.label}</span>
            <div className="flex-1 h-6 rounded-lg bg-[#F3F4F5] overflow-hidden">
              <div
                className="h-full rounded-lg flex items-center px-2 transition-all"
                style={{ width: `${Math.max((step.value / max) * 100, 6)}%`, background: step.color }}
              >
                <span className="text-[10px] font-bold text-white tabular-nums drop-shadow">{step.value}</span>
              </div>
            </div>
            <span className="text-[11px] text-[#747F8D] tabular-nums w-12 text-right">
              {max > 0 && steps[0]?.value > 0 ? `${Math.round((step.value / steps[0].value) * 100)}%` : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
