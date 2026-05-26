import { X } from 'lucide-react'

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p> : null}
        <h1 className="text-2xl font-bold tracking-normal text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <div className="panel max-h-[90vh] w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Đóng">
            <X size={17} />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-auto px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}

export function StatusBadge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    info: 'bg-blue-50 text-blue-700 ring-blue-200',
    brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`inline-flex h-6 w-11 items-center rounded-full p-0.5 transition ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}
      onClick={() => onChange(!checked)}
      aria-label={label}
      aria-pressed={checked}
    >
      <span className={`h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export function MetricCard({ label, value, delta, icon }) {
  return (
    <div className="panel flex min-h-24 items-start justify-between p-5">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-3xl font-bold text-ink">{value}</p>
          {delta ? <span className="mb-1 text-xs font-semibold text-emerald-500">{delta}</span> : null}
        </div>
      </div>
      <div className="rounded bg-brand-50 p-2 text-brand-600">{icon}</div>
    </div>
  )
}
