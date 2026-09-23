import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'

interface SearchBarProps {
  onSearch: (term: string) => void
  debounceMs?: number
}

// Local state so typing feels instant; only reports to the parent after
// debounceMs, so filtering isn't recomputed on every keystroke.
export function SearchBar({ onSearch, debounceMs = 300 }: SearchBarProps) {
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebounce(term, debounceMs)

  useEffect(() => {
    onSearch(debouncedTerm)
  }, [debouncedTerm, onSearch])

  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="employee-search" className="sr-only">
        Search employees by name, email or role
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          id="employee-search"
          type="search"
          name="employee-search"
          autoComplete="off"
          spellCheck={false}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search by name, email or role…"
          className="w-full rounded-md border border-hairline-strong bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}
