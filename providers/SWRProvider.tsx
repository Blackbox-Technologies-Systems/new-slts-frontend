"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import apiClient from "@/lib/apiClient";

/**
 * =========================================================================
 * GLOBAL SWR CONFIGURATION & TEAM DOCUMENTATION
 * =========================================================================
 * 
 * We have two ways to call the API across the application:
 * 
 * 1. NORMAL API CALLS:
 *    Use `apiClient.get()`, `apiClient.post()`, etc. natively or through functions inside `services/`.
 *    - Best for Mutations (POST, PUT, DELETE).
 *    - Best for events triggered by an action (e.g. clicking a 'Submit' button).
 * 
 * 2. SWR (Stale-While-Revalidate) API CALLS:
 *    Use the `useSWR` hook imported from the `"swr"` package.
 *    - Best for Fetching Data (GET requests) that UI components rely on.
 *    - It caches responses globally. If 5 components render and request `/api/users`, only ONE network call happens.
 *    - It returns stale data instantly (fast UI) whilst fetching fresh data in the background.
 * 
 * --- SWR USAGE EXAMPLE ---
 * 
 * import useSWR from "swr";
 * 
 * export function UserProfile() {
 *   // The fetcher function is already configured below to use `apiClient.get(url)`.
 *   // So you only need to pass the endpoint!
 *   const { data, error, isLoading, isValidating, mutate } = useSWR<User>("/api/users/profile");
 * 
 *   if (isLoading) return <Loading />;
 *   if (error) return <ErrorState />;
 *   
 *   return <div>{data.name}</div>;
 * }
 * =========================================================================
 */

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Global Fetcher: Uses our existing Axios apiClient infrastructure
        // so that all cookies/auth interceptors are applied automatically.
        fetcher: (resource: string) => apiClient.get(resource).then((res) => res.data),

        // Default SWR Options:
        revalidateOnFocus: true, // Auto-refetch when user switches tabs back to the app
        shouldRetryOnError: true, // Retry on errors automatically
        dedupingInterval: 2000,   // Deduplicate requests with the same key in this time span
      }}
    >
      {children}
    </SWRConfig>
  );
}
