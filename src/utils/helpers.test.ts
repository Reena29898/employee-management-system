import { describe, expect, it } from 'vitest'
import { buildEmployeeRoster, clampPage, sortEmployees } from './helpers'
import type { Employee } from '../types/employee'

const baseTen: Employee[] = [
  { id: 1, firstName: 'Alice', lastName: 'Nguyen', email: 'alice@x.com', department: 'Engineering', role: 'Dev', status: 'Active' },
  { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@x.com', department: 'Sales', role: 'AE', status: 'Active' },
  { id: 3, firstName: 'Carla', lastName: 'Rossi', email: 'carla@x.com', department: 'Marketing', role: 'SEO', status: 'Active' },
  { id: 4, firstName: 'David', lastName: 'Khan', email: 'david@x.com', department: 'HR', role: 'Recruiter', status: 'Active' },
  { id: 5, firstName: 'Elena', lastName: 'Fischer', email: 'elena@x.com', department: 'Finance', role: 'Analyst', status: 'Active' },
  { id: 6, firstName: 'Farid', lastName: 'Dubois', email: 'farid@x.com', department: 'Support', role: 'Help Desk', status: 'Active' },
  { id: 7, firstName: 'Grace', lastName: 'Costa', email: 'grace@x.com', department: 'Engineering', role: 'QA', status: 'Active' },
  { id: 8, firstName: 'Hassan', lastName: 'Meyer', email: 'hassan@x.com', department: 'Sales', role: 'Manager', status: 'Active' },
  { id: 9, firstName: 'Isabel', lastName: 'Alvarez', email: 'isabel@x.com', department: 'Marketing', role: 'Content', status: 'Active' },
  { id: 10, firstName: 'Jonas', lastName: 'Patel', email: 'jonas@x.com', department: 'HR', role: 'Partner', status: 'Active' },
]

describe('buildEmployeeRoster', () => {
  it('returns an empty array unchanged', () => {
    expect(buildEmployeeRoster([])).toEqual([])
  })

  it('produces a full cross product with no duplicate names, emails or ids', () => {
    const roster = buildEmployeeRoster(baseTen)
    expect(roster).toHaveLength(baseTen.length * baseTen.length)

    const names = roster.map((e) => `${e.firstName} ${e.lastName}`)
    const emails = roster.map((e) => e.email)
    const ids = roster.map((e) => e.id)
    expect(new Set(names).size).toBe(names.length)
    expect(new Set(emails).size).toBe(emails.length)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps the real data for a row that matches an actual fetched person', () => {
    const roster = buildEmployeeRoster(baseTen)
    const alice = roster.find((e) => e.firstName === 'Alice' && e.lastName === 'Nguyen')
    expect(alice?.email).toBe('alice@x.com')
    expect(alice?.department).toBe('Engineering')
  })
})

describe('sortEmployees', () => {
  const employees: Employee[] = [
    { id: 2, firstName: 'Bob', lastName: 'Zed', email: 'b@x.com', department: 'Sales', role: 'AE', status: 'Active' },
    { id: 1, firstName: 'Alice', lastName: 'Anders', email: 'a@x.com', department: 'Engineering', role: 'Dev', status: 'Active' },
  ]

  it('sorts by name and by id in either direction, without mutating the input', () => {
    expect(sortEmployees(employees, { key: 'name', direction: 'asc' }).map((e) => e.lastName)).toEqual([
      'Anders',
      'Zed',
    ])
    expect(sortEmployees(employees, { key: 'id', direction: 'desc' }).map((e) => e.id)).toEqual([2, 1])
    expect(employees[0].lastName).toBe('Zed')
  })
})

describe('clampPage', () => {
  it('clamps into range at both ends, and falls back to 1 when there are no pages', () => {
    expect(clampPage(0, 5)).toBe(1)
    expect(clampPage(9, 5)).toBe(5)
    expect(clampPage(3, 0)).toBe(1)
  })
})
