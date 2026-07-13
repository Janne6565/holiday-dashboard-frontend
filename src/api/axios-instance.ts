import axios, { type AxiosRequestConfig } from "axios";

// Single axios instance used as the Orval mutator. All generated API functions
// go through this, so cross-cutting concerns (base URL, credentials, error
// shaping) live in one place. Mirrors cosy-domain-provider's customInstance.
export const AXIOS_INSTANCE = axios.create({ baseURL: "/" });

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(({ data }) => data);
  // @ts-expect-error attach cancel for React cleanup, matching the Orval mutator contract
  promise.cancel = () => source.cancel("Query was cancelled");
  return promise;
};
