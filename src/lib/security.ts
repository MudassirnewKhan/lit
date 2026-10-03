// File Path: src/lib/security.ts
import { randomBytes } from 'crypto';
import { authenticator } from 'otplib';

// Accept the previous/next 30s code too, so small clock drift doesn't lock people out.
authenticator.options = { window: 1 };

/** Cryptographically secure temporary password (12 URL-safe characters). */
export function generateTempPassword(): string {
  return randomBytes(9).toString('base64url');
}

/** Returns true only if `code` is a valid 6-digit TOTP code for `secret`. */
export function verifyTotp(code: string, secret: string): boolean {
  try {
    return /^\d{6}$/.test(code) && authenticator.check(code, secret);
  } catch {
    return false;
  }
}

// bcrypt only uses the first 72 bytes, so longer passwords add nothing.
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 72;

export function validateNewPassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}
