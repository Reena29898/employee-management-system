// Strips tags and control characters, then trims. Used on form input and
// API data before either touches state, since React's escaping alone
// doesn't stop bad data from ending up in the CSV/JSON export.
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim())
}

const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s'-]{0,49}$/

export function isValidName(name: string): boolean {
  return NAME_PATTERN.test(name.trim())
}

const ROLE_PATTERN = /^[a-zA-Z0-9\s'&/-]{2,60}$/

export function isValidRole(role: string): boolean {
  return ROLE_PATTERN.test(role.trim())
}
