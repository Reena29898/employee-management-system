interface LoadingProps {
  label?: string
}

export function Loading({ label = 'Loading employees…' }: LoadingProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-ink-muted">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-hairline-strong border-t-primary"
      />
      <span>{label}</span>
    </div>
  )
}
