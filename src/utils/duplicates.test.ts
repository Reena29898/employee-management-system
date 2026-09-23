import { describe, expect, it } from 'vitest'
import { findEmailDuplicate } from './duplicates'
import type { Employee } from '../types/employee'

const employees: Employee[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Nguyen',
    email: 'alice.nguyen@example.com',
    department: 'Engineering',
    role: 'Frontend Developer',
    status: 'Active',
  },
]

describe('findEmailDuplicate', () => {
  it('finds a match regardless of case or surrounding whitespace', () => {
    expect(findEmailDuplicate('  ALICE.NGUYEN@EXAMPLE.COM  ', employees)).toBe(employees[0])
  })

  it('returns undefined when no employee has that email', () => {
    expect(findEmailDuplicate('new.person@example.com', employees)).toBeUndefined()
  })

  it('excludes the record being edited, so saving your own email is not a duplicate', () => {
    expect(findEmailDuplicate('alice.nguyen@example.com', employees, 1)).toBeUndefined()
  })

  it('still flags a duplicate against someone else while editing a different record', () => {
    const twoEmployees: Employee[] = [
      ...employees,
      { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com', department: 'Sales', role: 'AE', status: 'Active' },
    ]
    expect(findEmailDuplicate('alice.nguyen@example.com', twoEmployees, 2)).toBe(twoEmployees[0])
  })
})
