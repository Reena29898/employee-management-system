/**
 * Defensive input handling for anything that originates outside our own
 * code: form input and API data. React already escapes text it renders, so
 * this isn't a substitute for that, it's the layer that keeps bad input out
 * of state in the first place (and out of the CSV/JSON export downstream).
 */

/** Strips tags and control characters, then trims. Safe to store in state. */
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
