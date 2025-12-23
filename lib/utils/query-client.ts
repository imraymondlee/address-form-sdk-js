import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // Cache fetched results for 30 minutes
      retry: 2, // Will retry failed requests 2 times before displaying an error
    },
  },
});
