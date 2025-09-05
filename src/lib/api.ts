/**
 * Extended Error interface for API-related errors
 * Provides additional properties to categorize and handle different types of API failures
 */
export interface ApiError extends Error {
  /** HTTP status code from the API response */
  status?: number;
  /** HTTP status text from the API response */
  statusText?: string;
  /** Indicates if the error is due to network connectivity issues */
  isNetworkError?: boolean;
  /** Indicates if the error is due to backend service being down (5xx status codes) */
  isBackendDown?: boolean;
}

/**
 * Generic API fetch wrapper that handles common error scenarios and response parsing
 * @param path - API endpoint path (will be prefixed with '/api')
 * @param options - Optional fetch configuration options
 * @returns Promise that resolves to the parsed JSON response or void for empty responses
 * @throws ApiError for API-related errors or network issues
 */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T | void> {
  try {
    // Make the API request with default JSON content type
    const res = await fetch(`/api${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    // Handle non-successful HTTP responses
    if (!res.ok) {
      const text = await res.text();
      const error = new Error(`API error ${res.status}: ${text}`) as ApiError;
      error.status = res.status;
      error.statusText = res.statusText;
      // Mark 5xx errors as backend down issues
      error.isBackendDown = res.status >= 500;
      throw error;
    }

    // Handle empty responses (204 No Content or 201 Created without content)
    if (res.status === 204 || (res.status === 201 && !res.headers.get("Content-Length"))) {
      return;
    }

    // Attempt to parse JSON response, return void if parsing fails
    try {
      return (await res.json()) as T;
    } catch {
      return;
    }
  } catch (error) {
    // Handle network connectivity errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      const networkError = new Error('Network connection failed. Please check your internet connection.') as ApiError;
      networkError.isNetworkError = true;
      throw networkError;
    }
    
    // Re-throw API errors (already processed above)
    throw error;
  }
}

/**
 * Type guard to check if an error is related to backend connectivity issues
 * @param error - Unknown error to check
 * @returns True if the error is an ApiError indicating backend connectivity problems
 */
export function isBackendError(error: unknown): error is ApiError {
  return error instanceof Error && (
    error.message.includes('API error 5') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError')
  );
}

/**
 * Converts technical error messages into user-friendly error messages
 * @param error - Unknown error to process
 * @param fallback - Default message to return if error cannot be processed
 * @returns User-friendly error message string
 */
export function getErrorMessage(error: unknown, fallback: string = 'An unexpected error occurred'): string {
  if (error instanceof Error) {
    // Handle specific error types with user-friendly messages
    if (error.message.includes('API error 500')) {
      return 'Backend service is temporarily unavailable. Please try again later.';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Network connection failed. Please check your internet connection.';
    }
    return error.message;
  }
  return fallback;
}
