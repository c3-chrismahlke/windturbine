import useSWRSubscription from 'swr/subscription';

/**
 * Interface representing a power reading from a wind turbine
 * Contains real-time power output data with optional outlier detection information
 */
export interface PowerReading {
  /** Unique identifier of the wind turbine */
  windTurbineId: string;
  /** Power output in kilowatts */
  powerKW: number;
  /** ISO timestamp when the reading was taken */
  timestamp: string;
  /** Optional flag indicating if this reading is an outlier */
  outlier?: boolean;
  /** Optional type of outlier detected (e.g., 'high', 'low', 'anomaly') */
  outlierType?: string;
}

/**
 * Custom hook for streaming real-time power output data from wind turbines
 * Uses Server-Sent Events (SSE) to receive live updates without polling
 * 
 * @param turbineIds - Array of wind turbine IDs to stream data for
 * @param interval - Update interval in seconds (default: 1 second)
 * @returns SWR subscription object with real-time power reading data
 */
export function useTurbineStream(
  turbineIds: string[] = [],
  interval: number = 5
) {
  return useSWRSubscription<PowerReading[] | PowerReading>(
    // Create unique cache key based on turbine IDs and interval
    ['turbine-stream', ...turbineIds, interval],
    (
      _key: string | string[],
      {
        next,
      }: {
        next: (err?: Error, data?: PowerReading[] | PowerReading) => void;
      }
    ) => {
      // Early return if no turbine IDs provided
      if (!turbineIds?.length) return () => {};

      // Build query parameters for the stream endpoint
      const params = new URLSearchParams({
        windTurbineIds: turbineIds.join(','),
        interval: String(interval),
      });

      // Use same-origin proxy to avoid CORS and ensure cookies/headers if needed
      const url = `/api/stream-proxy?${params.toString()}`;
      const es = new EventSource(url);

      /**
       * Event handler for processing incoming power output data
       * Handles both single readings and batch readings from the SSE stream
       */
      const onPowerOutput = (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          // Handle batch power outputs (array of readings)
          if (payload?.powerOutputs) {
            next(undefined, payload.powerOutputs as PowerReading[]);
          } else {
            // Handle single power output reading
            next(undefined, payload as PowerReading);
          }
        } catch (err) {
          // Forward parsing errors to the subscription
          next(err as Error);
        }
      };

      // Listen for specific 'power-output' events
      es.addEventListener('power-output', onPowerOutput as EventListener);
      // Also listen for general messages as fallback
      es.onmessage = onPowerOutput;

      // Handle EventSource errors and cleanup
      es.onerror = (err) => {
        console.error('❌ SSE error', err);
        next(new Error('EventSource failed'));
        es.close();
      };

      // Return cleanup function to close the EventSource when component unmounts
      return () => {
        es.removeEventListener('power-output', onPowerOutput as EventListener);
        es.close();
      };
    }
  );
}
