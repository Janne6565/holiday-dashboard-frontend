import { KONSOLE_HEADER, getStoredKonsolePassword } from "@/lib/konsole-auth";
import axios, { type AxiosRequestConfig } from "axios";

// Single axios instance used as the Orval mutator. All generated API functions
// go through this, so cross-cutting concerns (base URL, credentials, error
// shaping) live in one place. Mirrors cosy-domain-provider's customInstance.
export const AXIOS_INSTANCE = axios.create({ baseURL: "/" });

// Attach the Konsole password to every request once the user has unlocked. Reads
// (GET) ignore it server-side; mutations require it, so this is what makes the
// board editable after unlocking.
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const password = getStoredKonsolePassword();
  if (password) {
    config.headers.set(KONSOLE_HEADER, password);
  }
  return config;
});

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(({ data }) => data);
  // @ts-expect-error attach cancel for React cleanup, matching the Orval mutator contract
  promise.cancel = () => source.cancel("Query was cancelled");
  return promise;
};

/**
 * Validate a candidate Konsole password against the backend without storing it.
 * Returns true on 204 (correct), false on 401 (wrong) or any network error.
 */
export const verifyKonsolePassword = async (password: string): Promise<boolean> => {
  try {
    await AXIOS_INSTANCE.post("/api/v1/auth/verify", null, {
      headers: { [KONSOLE_HEADER]: password },
    });
    return true;
  } catch {
    return false;
  }
};
