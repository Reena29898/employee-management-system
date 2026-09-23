import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { DEPARTMENTS, STATUSES } from '../types/employee'
import type { Employee, EmployeeFormErrors, EmployeeFormValues, NewEmployee } from '../types/employee'
import { isValidEmail, isValidName, isValidRole, sanitizeText } from '../utils/sanitize'
import { findEmailDuplicate } from '../utils/duplicates'

interface EmployeeFormProps {
  initialValues?: EmployeeFormValues
  /** The record being edited, excluded from its own duplicate-email check. */
  editingId?: number
  submitLabel?: string
  employees: Employee[]
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

const FIELD_ORDER: (keyof EmployeeFormValues)[] = ['firstName', 'lastName', 'email', 'department', 'role']

function validate(values: EmployeeFormValues, employees: Employee[], editingId?: number): EmployeeFormErrors {
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
  } else {
    const duplicate = findEmailDuplicate(values.email, employees, editingId)
    if (duplicate) {
      errors.email = `This employee has already been added, as ${duplicate.firstName} ${duplicate.lastName} (${duplicate.department} · ${duplicate.role}).`
    }
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

export function EmployeeForm({
  initialValues,
  editingId,
  submitLabel = 'Add employee',
  employees,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [values, setValues] = useState<EmployeeFormValues>(initialValues ?? EMPTY_VALUES)
  const [errors, setErrors] = useState<EmployeeFormErrors>({})
  const fieldRefs = useRef<Partial<Record<keyof EmployeeFormValues, HTMLInputElement | HTMLSelectElement | null>>>(
    {},
  )

  function handleChange<K extends keyof EmployeeFormValues>(field: K, value: EmployeeFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const validationErrors = validate(values, employees, editingId)
    setErrors(validationErrors)

    const firstInvalidField = FIELD_ORDER.find((field) => validationErrors[field])
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus()
      return
    }

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
            name="firstName"
            autoComplete="given-name"
            ref={(el) => {
              fieldRefs.current.firstName = el
            }}
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
            name="lastName"
            autoComplete="family-name"
            ref={(el) => {
              fieldRefs.current.lastName = el
            }}
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
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          ref={(el) => {
            fieldRefs.current.email = el
          }}
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
            name="department"
            ref={(el) => {
              fieldRefs.current.department = el
            }}
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
            name="status"
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
          name="role"
          autoComplete="organization-title"
          ref={(el) => {
            fieldRefs.current.role = el
          }}
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
          className="rounded-md border border-hairline-strong px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-canvas-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 ${
    hasError
      ? 'border-danger focus:border-danger focus:ring-danger'
      : 'border-hairline-strong focus:border-primary focus:ring-primary'
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
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-ink-secondary">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
