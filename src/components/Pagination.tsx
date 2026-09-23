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

  if (totalRecords === 0) return null

  const rangeStart = (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, totalRecords)

  function handleJumpSubmit(event: FormEvent) {
    event.preventDefault()
    const page = Number(jumpValue)
    if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
    setJumpValue('')
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 sm:flex-row"
    >
      <p className="text-sm text-slate-600">
        Showing <span className="font-medium text-slate-900">{rangeStart}</span>
        {'–'}
        <span className="font-medium text-slate-900">{rangeEnd}</span> of{' '}
        <span className="font-medium text-slate-900">{totalRecords}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-2 text-sm text-slate-600" aria-current="page">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>

        <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
          <label htmlFor="jump-to-page" className="text-sm text-slate-600">
            Go to
          </label>
          <input
            id="jump-to-page"
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(event) => setJumpValue(event.target.value)}
            placeholder={String(currentPage)}
            className="w-16 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </form>
      </div>
    </nav>
  )
}
