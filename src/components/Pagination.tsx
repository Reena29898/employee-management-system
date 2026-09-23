import { useState, type FormEvent } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, totalRecords, pageSize, onPageChange }: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('')
  const [jumpError, setJumpError] = useState('')

  if (totalRecords === 0) return null

  const rangeStart = (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, totalRecords)

  function handleJumpSubmit(event: FormEvent) {
    event.preventDefault()
    const page = Number(jumpValue)

    if (!Number.isInteger(page) || page < 1 || page > totalPages) {
      setJumpError(`Enter a page between 1 and ${totalPages}.`)
      return
    }

    onPageChange(page)
    setJumpValue('')
    setJumpError('')
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-hairline pt-4 sm:flex-row"
    >
      <p className="text-sm text-ink-muted">
        Showing <span className="font-medium tabular-nums text-ink">{rangeStart}</span>
        {'–'}
        <span className="font-medium tabular-nums text-ink">{rangeEnd}</span> of{' '}
        <span className="font-medium tabular-nums text-ink">{totalRecords}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-md border border-hairline-strong px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-2 text-sm tabular-nums text-ink-muted" aria-current="page">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-md border border-hairline-strong px-3 py-1.5 text-sm font-medium text-ink-secondary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        <form onSubmit={handleJumpSubmit} noValidate className="flex items-center gap-1.5">
          <label htmlFor="jump-to-page" className="text-sm text-ink-muted">
            Go to
          </label>
          <input
            id="jump-to-page"
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(event) => {
              setJumpValue(event.target.value)
              if (jumpError) setJumpError('')
            }}
            placeholder={String(currentPage)}
            aria-invalid={Boolean(jumpError)}
            aria-describedby={jumpError ? 'jump-to-page-error' : undefined}
            className={`w-16 rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${
              jumpError
                ? 'border-danger focus:border-danger focus:ring-danger'
                : 'border-hairline-strong focus:border-primary focus:ring-primary'
            }`}
          />
        </form>
      </div>

      {jumpError && (
        <p id="jump-to-page-error" role="alert" className="w-full text-right text-xs text-danger sm:w-auto">
          {jumpError}
        </p>
      )}
    </nav>
  )
}
