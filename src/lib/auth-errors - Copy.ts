import type { AuthError } from "@supabase/supabase-js";

const ERROR_MAP: [RegExp, string][] = [
  [/invalid login credentials/i, "Incorrect email or password. Please try again."],
  [/email not confirmed/i, "Please confirm your email before signing in. Check your inbox for the confirmation link."],
  [/user not found/i, "No account found with this email address."],
  [/invalid email/i, "Please enter a valid email address."],
  [/email address invalid/i, "Please enter a valid email address."],
  [/password should be at least/i, "Password must be at least 6 characters."],
  [/weak password/i, "Choose a stronger password with at least 6 characters."],
  [/signup is disabled/i, "New sign-ups are currently unavailable. Please contact support."],
  [/user already registered/i, "An account with this email already exists. Try signing in instead."],
  [/rate limit|too many requests/i, "Too many attempts. Please wait a moment and try again."],
  [/network|fetch failed|failed to fetch/i, "Connection issue. Check your internet and try again."],
  [/session expired|invalid refresh token/i, "Your session has expired. Please sign in again."],
  [/token has expired|otp expired/i, "This reset link has expired. Request a new one below."],
  [/same password/i, "Choose a different password from your current one."],
];

export function getAuthErrorMessage(error: AuthError | string | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";

  const message = typeof error === "string" ? error : error.message;
  if (!message) return "Something went wrong. Please try again.";

  for (const [pattern, friendly] of ERROR_MAP) {
    if (pattern.test(message)) return friendly;
  }

  return "Something went wrong. Please try again or contact support.";
}
