// src/lib/analytics.ts
import useSWR from 'swr';
import { apiFetch, isBackendError, getErrorMessage } from '@lib/api';

export type SystemSummary = {
  totalTurbines: number;
  activeTurbines: number;
  totalWorkOrders: number;
  openWorkOrders: number;
  inProgressWorkOrders: number;
  avgPowerOutput: number; // kW over last 24h
};

export type StatusBucket = {
  status: 'open' | 'in_progress' | 'closed' | string;
  count: number;
};

export type TurbineWorkOrderSummary = {
  turbineId: string;
  turbineName: string;
  totalWorkOrders: number;
  statusBreakdown: StatusBucket[];
  averageResolutionDays: number;
};

export function useSystemSummary(options?: { refreshMs?: number }) {
  const refreshInterval = options?.refreshMs ?? 60_000;
  return useSWR<SystemSummary>(
    '/1/summary',
    async (url) => {
      try {
        return await apiFetch<SystemSummary>(url);
      } catch (error) {
        // Log error for debugging
        console.error('Failed to fetch system summary:', error);
        
        // Re-throw with more context
        if (isBackendError(error)) {
          throw new Error(`Backend service unavailable: ${getErrorMessage(error)}`);
        }
        throw error;
      }
    },
    { 
      refreshInterval, 
      revalidateOnFocus: false,
      shouldRetryOnError: (error) => {
        // Don't retry on backend errors to avoid spam
        return !isBackendError(error);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );
}

export function useTurbineWorkOrderSummary(
  turbineId?: string,
  options?: { refreshMs?: number }
) {
  const refreshInterval = options?.refreshMs ?? 60_000;
  const key = turbineId
    ? `/1/summary/windturbines/${turbineId}/workorders`
    : null;
  return useSWR<TurbineWorkOrderSummary>(
    key,
    async (url) => {
      try {
        return await apiFetch<TurbineWorkOrderSummary>(url);
      } catch (error) {
        console.error('Failed to fetch turbine work order summary:', error);
        
        if (isBackendError(error)) {
          throw new Error(`Backend service unavailable: ${getErrorMessage(error)}`);
        }
        throw error;
      }
    },
    { 
      refreshInterval, 
      revalidateOnFocus: false,
      shouldRetryOnError: (error) => {
        return !isBackendError(error);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );
}
