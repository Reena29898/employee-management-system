import { useEffect, useRef } from 'react'
import { DEPARTMENTS, type Department } from '../types/employee'

interface FilterPanelProps {
  selectedDepartments: Department[]
  onChange: (departments: Department[]) => void
}

// Native <details>/<summary> for free keyboard support. It doesn't close on
// an outside click by default though, so that's handled manually below.
export function FilterPanel({ selectedDepartments, onChange }: FilterPanelProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const details = detailsRef.current
      if (details?.open && !details.contains(event.target as Node)) {
        details.open = false
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function toggleDepartment(department: Department) {
    const isSelected = selectedDepartments.includes(department)
    onChange(
      isSelected
        ? selectedDepartments.filter((item) => item !== department)
        : [...selectedDepartments, department],
    )
  }

  const summaryLabel =
    selectedDepartments.length === 0
      ? 'Filter by department'
      : `Department: ${selectedDepartments.length} selected`

  return (
    <details ref={detailsRef} className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-hairline-strong px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft [&::-webkit-details-marker]:hidden">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.66 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
            clipRule="evenodd"
          />
        </svg>
        {summaryLabel}
      </summary>
      <fieldset className="absolute z-10 mt-2 w-56 rounded-md border border-hairline bg-canvas p-3 shadow-level-2">
        <legend className="mb-2 px-0 text-xs font-semibold uppercase text-ink-muted">Department</legend>
        <div className="space-y-2">
          {DEPARTMENTS.map((department) => (
            <label key={department} className="flex items-center gap-2 text-sm text-ink-secondary">
              <input
                type="checkbox"
                checked={selectedDepartments.includes(department)}
                onChange={() => toggleDepartment(department)}
                className="h-4 w-4 rounded border-hairline-strong text-primary focus:ring-primary"
              />
              {department}
            </label>
          ))}
        </div>
        {selectedDepartments.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            Clear filter
          </button>
        )}
      </fieldset>
    </details>
  )
}
