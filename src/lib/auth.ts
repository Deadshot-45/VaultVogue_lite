import Cookies from "js-cookie";

/**
 * Key used for storing authentication token in cookies
 */
export const AUTH_COOKIE_KEY =
  process.env.AUTH_COOKIE_KEY || "vault_vogue_token";

/**
 * Custom cookie options type (aligned with js-cookie options)
 */
type CookieOptions = {
  expires?: number | Date; // Expiry in days OR exact Date
  secure?: boolean; // Send only over HTTPS
  sameSite?: "strict" | "lax" | "none"; // CSRF protection policy
  path?: string; // Cookie path scope
};

/**
 * Default cookie configuration
 * - 7 days expiry
 * - secure only in production
 * - lax sameSite for balanced security/usability
 * - root path access
 */
const defaultOptions: CookieOptions = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

/**
 * Set a cookie with optional overrides
 *
 * @param key - cookie name
 * @param value - cookie value
 * @param options - optional overrides for cookie behavior
 */
export const setCookie = (
  key: string,
  value: string,
  options?: CookieOptions,
) => {
  Cookies.set(key, value, {
    ...defaultOptions,
    ...options, // override defaults if provided
  });
};

/**
 * Get a cookie value by key
 *
 * @param key - cookie name
 * @returns string value or null if not found
 */
export const getCookie = (key: string) => {
  return Cookies.get(key) ?? null;
};

/**
 * Get all cookies as key-value pairs
 *
 * @returns Record<string, string>
 */
export const getAllCookies = () => {
  return Cookies.get();
};

/**
 * Remove a cookie
 *
 * ⚠️ Important:
 * Must match the same path used when setting the cookie
 *
 * @param key - cookie name
 */
export const removeCookie = (key: string) => {
  Cookies.remove(key, { path: "/" });
};

/**
 * Set a cookie with expiry defined in hours
 *
 * @param key - cookie name
 * @param value - cookie value
 * @param hours - expiry time in hours
 * @param options - additional cookie options (excluding expires)
 */
export const setCookieWithHours = (
  key: string,
  value: string,
  hours: number,
  options?: Omit<CookieOptions, "expires">,
) => {
  // Convert hours → exact expiry Date
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  Cookies.set(key, value, {
    ...defaultOptions,
    ...options,
    expires: expiresAt,
  });
};

/**
 * Set a cookie with expiry defined in minutes instead of days
 *
 * Useful for:
 * - short-lived tokens
 * - OTP/session cookies
 *
 * @param key - cookie name
 * @param value - cookie value
 * @param minutes - expiry time in minutes
 * @param options - additional cookie options (excluding expires)
 */
export const setCookieWithMinutes = (
  key: string,
  value: string,
  minutes: number,
  options?: Omit<CookieOptions, "expires">,
) => {
  // Convert minutes → exact expiry Date
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  Cookies.set(key, value, {
    ...defaultOptions,
    ...options,
    expires: expiresAt,
  });
};

type ExpiryUnit = "minutes" | "hours" | "days";

export const setCookieWithExpiry = (
  key: string,
  value: string,
  duration: number,
  unit: ExpiryUnit,
  options?: Omit<CookieOptions, "expires">,
) => {
  let expires: number | Date;

  if (unit === "days") {
    expires = duration;
  } else {
    const multiplier = unit === "minutes" ? 60 * 1000 : 60 * 60 * 1000;

    expires = new Date(Date.now() + duration * multiplier);
  }

  Cookies.set(key, value, {
    ...defaultOptions,
    ...options,
    expires,
  });
};

/**
 * Set authentication cookie
 *
 * @param token - auth token (JWT or session token)
 * @param expiresInDays - expiry duration in days (default: 7)
 */
export const setAuthCookie = (token: string, expiresInDays = 7) => {
  setCookie(AUTH_COOKIE_KEY, token, { expires: expiresInDays });
};

/**
 * Retrieve authentication cookie
 *
 * @returns auth token or null
 */
export const getAuthCookie = () => {
  return getCookie(AUTH_COOKIE_KEY);
};

/**
 * Clear authentication cookie (logout use-case)
 */
export const clearAuthCookie = () => {
  removeCookie(AUTH_COOKIE_KEY);
};

type JwtPayload = {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  if (typeof window !== "undefined") {
    return window.atob(padded);
  }

  return "";
};

export const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const payload = parseJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};
