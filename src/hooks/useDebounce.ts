import { useEffect, useState } from 'react'

/**
 * Returns a copy of `value` that only updates after `delay` ms have passed
 * without `value` changing. Used to stop the search input from triggering a
 * filter recompute on every keystroke.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}
