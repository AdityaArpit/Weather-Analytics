import React from 'react';
import { Loader2, AlertTriangle, Inbox, X } from 'lucide-react';

// ============================================================================
// Aapda Drishti Premium UI Kit — shared primitives. Every surface in the
// product composes these; no page-local re-implementations.
// Palette: #0F1B29 ink, #747F8D muted, #DDDDDD border/CTA, #F3F4F5 surface,
// #FFFFFF, #ECF8F8 background.
// ============================================================================

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function PremiumCard({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <Tag
      className={cx(
        'bg-white border border-[#DDDDDD] rounded-3xl shadow-sm',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function PremiumPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PremiumCard className={className}>
      <div className="px-6 py-5 border-b border-[#DDDDDD]/70 flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <h2 className="text-sm font-bold text-[#0F1B29] uppercase tracking-wider">{title}</h2>
          {description && <p className="text-xs text-[#747F8D] leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="p-6">{children}</div>
    </PremiumCard>
  );
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  actions,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div className="space-y-1.5 min-w-0">
        {eyebrow && (
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#747F8D]">{eyebrow}</div>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-[#0F1B29] tracking-tight">{title}</h1>
        {description && <p className="text-sm text-[#747F8D] max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <PremiumCard className="p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#747F8D]">{label}</span>
        {icon && (
          <span className="w-8 h-8 rounded-xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center text-[#0F1B29]">
            {icon}
          </span>
        )}
      </div>
      <span className="text-2xl font-bold text-[#0F1B29] tabular-nums tracking-tight">{value}</span>
      {hint && <span className="text-[11px] text-[#747F8D] leading-snug">{hint}</span>}
    </PremiumCard>
  );
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

const BADGE_TONES: Record<string, string> = {
  neutral: 'bg-[#F3F4F5] text-[#46515E] border-[#DDDDDD]',
  ink: 'bg-[#0F1B29] text-[#ECF8F8] border-[#0F1B29]',
  danger: 'bg-[#0F1B29] text-[#ECF8F8] border-[#0F1B29]',
  warning: 'bg-[#F3F4F5] text-[#0F1B29] border-[#B8BEC5]',
  success: 'bg-[#ECF8F8] text-[#0F1B29] border-[#B8BEC5]',
};

export function StatusBadge({ tone = 'neutral', children }: { tone?: keyof typeof BADGE_TONES | string; children: React.ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-1',
        BADGE_TONES[tone] || BADGE_TONES.neutral,
      )}
    >
      {children}
    </span>
  );
}

export function HealthDot({ status }: { status: string }) {
  const ok = status === 'operational' || status === 'configured' || status === 'ok';
  const failed = status === 'degraded' || status === 'FAILED' || status === 'not_configured';
  return (
    <span className="relative flex h-2.5 w-2.5" aria-label={status}>
      <span
        className={cx(
          'absolute inline-flex h-full w-full rounded-full opacity-30',
          ok && 'bg-emerald-500',
          failed && 'bg-red-400',
          !ok && !failed && 'bg-[#747F8D]',
        )}
      />
      <span
        className={cx(
          'relative inline-flex rounded-full h-2.5 w-2.5',
          ok && 'bg-emerald-500',
          failed && 'bg-red-400',
          !ok && !failed && 'bg-[#747F8D]',
        )}
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Data table
// ---------------------------------------------------------------------------

export function DataTable<T>({
  columns,
  rows,
  keyOf,
  empty,
  dense,
}: {
  columns: Array<{ key: string; label: string; className?: string; render: (row: T) => React.ReactNode }>;
  rows: T[];
  keyOf: (row: T) => string;
  empty?: React.ReactNode;
  dense?: boolean;
}) {
  if (rows.length === 0 && empty) return <>{empty}</>;
  const cellPad = dense ? 'px-4 py-2' : 'px-4 py-3';
  return (
    <div className="overflow-x-auto -mx-6 -mb-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#DDDDDD]/80">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cx('text-left text-[10px] font-bold uppercase tracking-[0.14em] text-[#747F8D] px-4 py-3 whitespace-nowrap', col.className)}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={keyOf(row)} className="border-b border-[#DDDDDD]/50 last:border-0 hover:bg-[#F3F4F5]/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cx(cellPad, 'text-[#0F1B29] align-middle', col.className)}>
                  {col.render(row)}
                </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Forms
// ---------------------------------------------------------------------------

export function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F1B29]">{title}</h3>
        {description && <p className="text-xs text-[#747F8D] leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function InputField({
  label,
  id,
  hint,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; hint?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={cx(
          'w-full px-4 py-3 rounded-xl border bg-white text-sm text-[#0F1B29] placeholder:text-[#747F8D]/60',
          'focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all',
          error ? 'border-[#0F1B29]' : 'border-[#DDDDDD]',
          className,
        )}
      />
      {hint && !error && <p className="text-[11px] text-[#747F8D]">{hint}</p>}
      {error && (
        <p role="alert" className="text-[11px] font-medium text-[#0F1B29] flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  label,
  id,
  options,
  hint,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; options: Array<{ value: string; label: string }>; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-[#0F1B29] uppercase tracking-wider">
        {label}
      </label>
      <select
        id={id}
        {...props}
        className={cx(
          'w-full px-4 py-3 rounded-xl border border-[#DDDDDD] bg-white text-sm text-[#0F1B29]',
          'focus:outline-none focus:ring-2 focus:ring-[#0F1B29]/20 focus:border-[#0F1B29]/40 transition-all cursor-pointer',
          className,
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && <p className="text-[11px] text-[#747F8D]">{hint}</p>}
    </div>
  );
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={cx('flex items-start justify-between gap-4 py-2.5', disabled ? 'opacity-60' : 'cursor-pointer group')}>
      <span className="space-y-0.5 min-w-0">
        <span className="block text-sm font-semibold text-[#0F1B29]">{label}</span>
        {description && <span className="block text-xs text-[#747F8D] leading-relaxed">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1B29]/40',
          checked ? 'bg-[#0F1B29] border-[#0F1B29]' : 'bg-[#DDDDDD] border-[#B8BEC5]',
        )}
      >
        <span
          className={cx(
            'inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transform transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-[3px]',
            'mt-[2px]',
          )}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </label>
  );
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export function LoadingSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cx('space-y-3', className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-2xl bg-[#DDDDDD]/40 skeleton-shimmer" />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, icon, action }: { title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center text-[#747F8D]">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#0F1B29]">{title}</h3>
        {description && <p className="text-xs text-[#747F8D] max-w-sm leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F5] border border-[#DDDDDD] flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-[#0F1B29]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[#0F1B29]">Something went wrong</h3>
        <p className="text-xs text-[#747F8D] max-w-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cx('w-4 h-4 animate-spin', className)} />;
}

// ---------------------------------------------------------------------------
// Drawer / Modal
// ---------------------------------------------------------------------------

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-[#0F1B29]/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div className={cx('relative h-full w-full bg-white border-l border-[#DDDDDD] shadow-2xl flex flex-col', width)}>
        <div className="px-6 py-4 border-b border-[#DDDDDD] flex items-center justify-between gap-3 bg-[#F3F4F5]/40">
          <h2 className="text-sm font-bold text-[#0F1B29] uppercase tracking-wider">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl border border-[#DDDDDD] bg-white flex items-center justify-center text-[#0F1B29] hover:bg-[#F3F4F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

export function PrimaryButton({
  children,
  loading,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1B29] hover:bg-[#0f1b29]/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1B29]/40',
        className,
      )}
    >
      {loading && <Spinner className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DDDDDD] hover:bg-[#F3F4F5] disabled:opacity-60 text-[#0F1B29] font-semibold text-xs shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1B29]/30',
        className,
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

export interface ToastMessage {
  id: number;
  kind: 'success' | 'error' | 'info';
  text: string;
}

export function ToastStack({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[90] space-y-2 w-80 max-w-[calc(100vw-2.5rem)]" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cx(
            'flex items-start gap-2.5 p-3.5 rounded-2xl border shadow-lg text-xs leading-relaxed bg-white',
            toast.kind === 'success' && 'border-[#B8BEC5] bg-[#ECF8F8]',
            toast.kind === 'error' && 'border-[#0F1B29]',
            toast.kind === 'info' && 'border-[#DDDDDD]',
          )}
        >
          <span className="flex-1 text-[#0F1B29]">{toast.text}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss"
            className="text-[#747F8D] hover:text-[#0F1B29] cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const push = React.useCallback((kind: ToastMessage['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, kind, text }]);
    window.setTimeout(() => dismiss(id), 5200);
  }, [dismiss]);
  return { toasts, push, dismiss };
}
