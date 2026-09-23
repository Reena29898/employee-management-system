import type { Department } from '../types/employee'

// Shared by employeeApi.ts and helpers.ts so roles stay in one place.
export const ROLES_BY_DEPARTMENT: Record<Department, readonly string[]> = {
  Engineering: ['Frontend Developer', 'Backend Developer', 'QA Engineer', 'DevOps Engineer'],
  Sales: ['Account Executive', 'Sales Manager', 'Business Development Rep'],
  Marketing: ['Marketing Specialist', 'Content Strategist', 'SEO Analyst'],
  HR: ['HR Generalist', 'Recruiter', 'People Partner'],
  Finance: ['Financial Analyst', 'Accountant', 'Payroll Specialist'],
  Support: ['Support Engineer', 'Customer Success Manager', 'Help Desk Analyst'],
}
