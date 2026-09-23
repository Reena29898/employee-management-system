import { useState, type FormEvent, type ReactNode } from 'react'
import { DEPARTMENTS, STATUSES } from '../types/employee'
import type { EmployeeFormErrors, EmployeeFormValues, NewEmployee } from '../types/employee'
import { isValidEmail, isValidName, isValidRole, sanitizeText } from '../utils/sanitize'

interface EmployeeFormProps {
  initialValues?: EmployeeFormValues
  submitLabel?: string
  onSubmit: (employee: NewEmployee) => void
  onCancel: () => void
}

const EMPTY_VALUES: EmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  role: '',
  status: 'Active',
}

function validate(values: EmployeeFormValues): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {}

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.'
  } else if (!isValidName(values.firstName)) {
    errors.firstName = 'Use letters, spaces or hyphens only.'
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.'
  } else if (!isValidName(values.lastName)) {
    errors.lastName = 'Use letters, spaces or hyphens only.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.department) {
    errors.department = 'Department is required.'
  }

  if (!values.role.trim()) {
    errors.role = 'Role is required.'
  } else if (!isValidRole(values.role)) {
    errors.role = 'Role looks invalid, use 2-60 characters.'
  }

  return errors
}

export function EmployeeForm({ initialValues, submitLabel = 'Add employee', onSubmit, onCancel }: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>(initialValues ?? EMPTY_VALUES)
  const [errors, setErrors] = useState<EmployeeFormErrors>({})

  function handleChange<K extends keyof EmployeeFormValues>(field: K, value: EmployeeFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    onSubmit({
      firstName: sanitizeText(values.firstName),
      lastName: sanitizeText(values.lastName),
      email: sanitizeText(values.email).toLowerCase(),
      department: values.department as NewEmployee['department'],
      role: sanitizeText(values.role),
      status: values.status,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName}>
          <input
            id="firstName"
            value={values.firstName}
            onChange={(event) => handleChange('firstName', event.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            className={inputClassName(Boolean(errors.firstName))}
          />
        </Field>

        <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
          <input
            id="lastName"
            value={values.lastName}
            onChange={(event) => handleChange('lastName', event.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            className={inputClassName(Boolean(errors.lastName))}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(event) => handleChange('email', event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={inputClassName(Boolean(errors.email))}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Department" htmlFor="department" error={errors.department}>
          <select
            id="department"
            value={values.department}
            onChange={(event) => handleChange('department', event.target.value as EmployeeFormValues['department'])}
            aria-invalid={Boolean(errors.department)}
            aria-describedby={errors.department ? 'department-error' : undefined}
            className={inputClassName(Boolean(errors.department))}
          >
            <option value="">Select…</option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" htmlFor="status">
          <select
            id="status"
            value={values.status}
            onChange={(event) => handleChange('status', event.target.value as EmployeeFormValues['status'])}
            className={inputClassName(false)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Role" htmlFor="role" error={errors.role}>
        <input
          id="role"
          value={values.role}
          onChange={(event) => handleChange('role', event.target.value)}
          aria-invalid={Boolean(errors.role)}
          aria-describedby={errors.role ? 'role-error' : undefined}
          className={inputClassName(Boolean(errors.role))}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
  }`
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
