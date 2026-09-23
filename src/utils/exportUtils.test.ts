import { describe, expect, it } from 'vitest'
import { employeesToCsv, employeesToJson } from './exportUtils'
import type { Employee } from '../types/employee'

const employee: Employee = {
  id: 1,
  firstName: 'Alice',
  lastName: 'Nguyen',
  email: 'alice.nguyen@example.com',
  department: 'Engineering',
  role: 'Frontend Developer',
  status: 'Active',
}

describe('employeesToCsv', () => {
  it('includes a header row and one row per employee', () => {
    const csv = employeesToCsv([employee])
    const lines = csv.split('\r\n')
    expect(lines[0]).toBe('ID,First Name,Last Name,Email,Department,Role,Status')
    expect(lines[1]).toContain('Alice')
    expect(lines[1]).toContain('alice.nguyen@example.com')
  })

  it('neutralizes a value that looks like a spreadsheet formula', () => {
    const malicious: Employee = { ...employee, role: '=cmd|"/c calc"!A0' }
    const csv = employeesToCsv([malicious])
    // the cell must be prefixed with a quote so spreadsheet apps treat it as text
    expect(csv).toContain("'=cmd")
  })

  it('neutralizes +, - and @ prefixed values too', () => {
    for (const prefix of ['+', '-', '@']) {
      const malicious: Employee = { ...employee, role: `${prefix}SUM(A1:A9)` }
      const csv = employeesToCsv([malicious])
      expect(csv).toContain(`'${prefix}SUM`)
    }
  })

  it('quotes fields containing commas', () => {
    const withComma: Employee = { ...employee, role: 'Developer, Senior' }
    const csv = employeesToCsv([withComma])
    expect(csv).toContain('"Developer, Senior"')
  })
})

describe('employeesToJson', () => {
  it('produces valid, parseable JSON matching the input', () => {
    const json = employeesToJson([employee])
    expect(JSON.parse(json)).toEqual([employee])
  })
})
