import type { Employee } from '../types/employee'

const CSV_COLUMNS: { key: keyof Employee; label: string }[] = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]

// Spreadsheet apps treat a cell starting with any of these characters as a
// formula. A malicious record (e.g. name "=cmd|'/c calc'!A0") exported and
// later opened in Excel/Sheets would execute. Prefixing with a plain quote
// keeps the value visible but forces it to be read as text, not a formula.
const FORMULA_PREFIXES = ['=', '+', '-', '@']

function neutralizeFormulaInjection(value: string): string {
  return FORMULA_PREFIXES.includes(value.charAt(0)) ? `'${value}` : value
}

function toCsvCell(value: string): string {
  const safeValue = neutralizeFormulaInjection(value)
  const needsQuoting = /[",\n]/.test(safeValue)
  const escaped = safeValue.replace(/"/g, '""')
  return needsQuoting ? `"${escaped}"` : escaped
}

export function employeesToCsv(employees: Employee[]): string {
  const header = CSV_COLUMNS.map((column) => toCsvCell(column.label)).join(',')
  const rows = employees.map((employee) =>
    CSV_COLUMNS.map((column) => toCsvCell(String(employee[column.key]))).join(','),
  )
  return [header, ...rows].join('\r\n')
}

export function employeesToJson(employees: Employee[]): string {
  return JSON.stringify(employees, null, 2)
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadEmployeesCsv(employees: Employee[], filename = 'employees.csv'): void {
  downloadFile(employeesToCsv(employees), filename, 'text/csv;charset=utf-8;')
}

export function downloadEmployeesJson(employees: Employee[], filename = 'employees.json'): void {
  downloadFile(employeesToJson(employees), filename, 'application/json;charset=utf-8;')
}
