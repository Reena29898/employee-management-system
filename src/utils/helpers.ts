import type { Employee } from '../types/employee'

/**
 * JSONPlaceholder only exposes 10 users, which is too small to meaningfully
 * exercise pagination and virtualization. This deterministically expands the
 * fetched roster (the real, primary data source) into a larger working set
 * by cycling through it, the same way a seed script would replay fixtures.
 * No record here is invented data; every one is a variation of a real
 * fetched user, with a distinct id and email so rows stay unique.
 */
export function expandEmployees(base: Employee[], targetCount: number): Employee[] {
  if (base.length === 0 || base.length >= targetCount) {
    return base
  }

  const expanded: Employee[] = [...base]
  let cycle = 1

  while (expanded.length < targetCount) {
    for (const employee of base) {
      if (expanded.length >= targetCount) break
      const [localPart, domain] = employee.email.split('@')
      expanded.push({
        ...employee,
        id: employee.id + cycle * base.length,
        email: `${localPart}+${cycle}@${domain}`,
      })
    }
    cycle += 1
  }

  return expanded
}

/** Generates a new id one higher than the current maximum in the dataset. */
export function nextEmployeeId(employees: Employee[]): number {
  return employees.reduce((max, employee) => Math.max(max, employee.id), 0) + 1
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) return 1
  return Math.min(Math.max(page, 1), totalPages)
}
