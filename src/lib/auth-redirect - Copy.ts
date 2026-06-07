import { ROUTES } from "@/lib/routes";

export interface AuthRedirectState {
  from: string;
}

export function buildRedirectPath(pathname: string, hash = "", search = ""): string {
  return `${pathname}${search}${hash}`;
}

export function loginRedirectState(from: string): AuthRedirectState {
  return { from };
}

export function loginLink(from = ROUTES.app) {
  return { pathname: ROUTES.login, state: loginRedirectState(from) };
}

export function signupLink(from = ROUTES.app) {
  return { pathname: ROUTES.signup, state: loginRedirectState(from) };
}

/** Parse a stored redirect like `/app/create` into router location parts. */
export function parseRedirectTarget(from: string) {
  const url = new URL(from, "http://redirect.local");
  return {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
  };
}
