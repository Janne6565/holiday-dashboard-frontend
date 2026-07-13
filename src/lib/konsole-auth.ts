// Konsole password gate — client side. The backend guards every mutating
// endpoint with the shared password sent as the X-Konsole-Key header (mirrors
// the collector's X-Ingest-Key). We keep the entered password in sessionStorage
// so it survives reloads for the session but never lands in localStorage/disk.

export const KONSOLE_HEADER = "X-Konsole-Key";
const STORAGE_KEY = "konsole-password";

export function getStoredKonsolePassword(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // sessionStorage can throw in private-mode / SSR — treat as locked.
    return null;
  }
}

export function setStoredKonsolePassword(password: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, password);
  } catch {
    /* ignore — the header just won't be attached, mutations will 401 */
  }
}

export function clearStoredKonsolePassword(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
