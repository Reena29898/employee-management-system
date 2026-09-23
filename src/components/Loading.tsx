interface LoadingProps {
  label?: string
}

export function Loading({ label = 'Loading employees…' }: LoadingProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-slate-500">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
      />
      <span>{label}</span>
    </div>
  )
}
