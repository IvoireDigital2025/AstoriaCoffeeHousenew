import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const url = queryKey[0] as string;
        const response = await fetch(url, { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      },
    },
  },
});

export async function apiRequest(method: string, url: string, data?: any) {
  try {
    console.log(`Making ${method} request to ${url}`, data ? { data } : '');
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Request Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
