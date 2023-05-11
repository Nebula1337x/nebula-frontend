import { useFetch as uf } from '@vueuse/core';
import type { MaybeRefOrGetter, UseFetchReturn, UseFetchOptions } from '@vueuse/core';
import { Config } from '@/const/config.const';

export function useFetch<T>(url: MaybeRefOrGetter<string>, authorization: boolean = false, useFetchOptions: UseFetchOptions = {}): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  // if need authorized, attach access token to headers
  if (authorization) {
    const defaultFetchOptions: UseFetchOptions = {
      async beforeFetch({ options }) {
        const accessToken = '';
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
        return { options };
      }
    };
    
    // merge fetch options
    if (!useFetchOptions) useFetchOptions = {};

    useFetchOptions = {
      ...useFetchOptions,
      ...defaultFetchOptions
    }
  }

  return uf(`${Config.API_HOST}${url}`, useFetchOptions);
}