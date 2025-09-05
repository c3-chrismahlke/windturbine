import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Skeleton,
} from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useTranslation } from 'react-i18next';

import { apiFetch } from '@lib/api';
import type { WorkOrder, PaginatedWorkOrders } from '@models/WorkOrder';
import { WorkOrderCard, type WorkOrderComment } from '@your-scope/work-order-card';

type Props = {
  height?: number | string;
  turbineId?: string | null;
};

/**
 * Work orders list — UI-only refinements:
 * - Clear visual hierarchy (title prominence, secondary meta de-emphasized)
 * - Right-aligned action & status cluster with compact icons
 * - Smooth, obvious affordance for comments at the bottom-left
 * - Consistent spacing rhythm, focus & hover feedback
 * - Progressive disclosure for comments
 */
export default function WorkOrdersList({ height = 350, turbineId }: Props) {
  const { t } = useTranslation('common');
  const [items, setItems] = React.useState<WorkOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Prefetched comments keyed by workOrderId
  const [commentsById, setCommentsById] = React.useState<Record<string, WorkOrderComment[]>>({});
  const [commentsLoading, setCommentsLoading] = React.useState<Record<string, boolean>>({});

  // Which work-order card is expanded to show comments
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const qp = new URLSearchParams({ limit: '25', page: '1' });
        if (turbineId) qp.set('windTurbineId', turbineId);
        const res = await apiFetch<PaginatedWorkOrders | WorkOrder[]>(
          `/1/workorders?${qp.toString()}`
        );
        const data = Array.isArray(res) ? res : res?.data ?? [];
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : t('workOrders.failedToLoad'));
      } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [turbineId, t]);

  // Prefetch comments for visible work orders (UI convenience)
  React.useEffect(() => {
    if (!items.length) return;
    
    let cancelled = false;
    (async () => {
      const ids = items.map((w) => w.id);
      setCommentsLoading((prev) => {
        const next = { ...prev } as Record<string, boolean>;
        for (const id of ids) next[id] = true;
        return next;
      });
      
      await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await apiFetch<{ data?: WorkOrderComment[] } | WorkOrderComment[]>(
              `/1/workorders/${id}/comments?limit=20&page=1`
            );
            const list = Array.isArray(res)
              ? (res as WorkOrderComment[])
              : ((res as { data?: WorkOrderComment[] })?.data ?? []);
            if (!cancelled) setCommentsById((prev) => ({ ...prev, [id]: list }));
          } catch (e) {
            console.warn('Failed to fetch comments for work order', id, e);
            if (!cancelled) setCommentsById((prev) => ({ ...prev, [id]: [] }));
          } finally {
            if (!cancelled) setCommentsLoading((prev) => ({ ...prev, [id]: false }));
          }
        })
      );
    })();
    
    return () => {
      cancelled = true;
    };
  }, [items]); // Only depend on items, not on commentsById or commentsLoading

  const handleToggleExpand = React.useCallback((workOrderId: string) => {
    setExpandedId(prev => prev === workOrderId ? null : workOrderId);
  }, []);

  const handleLoadComments = React.useCallback(async (workOrderId: string) => {
    if (commentsById[workOrderId] || commentsLoading[workOrderId]) return;
    
    setCommentsLoading(prev => ({ ...prev, [workOrderId]: true }));
    try {
      const res = await apiFetch<{ data?: WorkOrderComment[] } | WorkOrderComment[]>(
        `/1/workorders/${workOrderId}/comments?limit=20&page=1`
      );
      const list = Array.isArray(res)
        ? (res as WorkOrderComment[])
        : ((res as { data?: WorkOrderComment[] })?.data ?? []);
      setCommentsById(prev => ({ ...prev, [workOrderId]: list }));
    } catch (e) {
      console.warn('Failed to fetch comments for work order', workOrderId, e);
      setCommentsById(prev => ({ ...prev, [workOrderId]: [] }));
    } finally {
      setCommentsLoading(prev => ({ ...prev, [workOrderId]: false }));
    }
  }, [commentsById, commentsLoading]);

  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      {/* Title Section */}
      <Box sx={{ px: 2, py: 1 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <BuildCircleIcon fontSize="small" color="primary" />
          <Typography variant="overline" sx={{ letterSpacing: 0.6, fontWeight: 600 }}>
            {t('turbine.workOrders.title')}
          </Typography>
        </Stack>
      </Box>
      
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <Stack spacing={1} sx={{ p: 1 }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Box key={idx} sx={{ p: 1.5 }}>
                <Skeleton variant="rectangular" height={120} />
              </Box>
            ))}
          </Stack>
        ) : error ? (
          <Typography color="error" sx={{ p: 1.5 }}>
            {error}
          </Typography>
        ) : !turbineId ? (
          <Typography sx={{ p: 1.5 }} color="text.secondary">
            {t('workOrders.selectTurbine')}
          </Typography>
        ) : items.length === 0 ? (
          <Typography sx={{ p: 1.5 }} color="text.secondary">
            {t('workOrders.noOrders')}
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ p: 1 }}>
            {items.map((workOrder) => (
              <WorkOrderCard
                key={workOrder.id}
                workOrder={workOrder}
                comments={commentsById[workOrder.id]}
                commentsLoading={commentsLoading[workOrder.id]}
                expanded={expandedId === workOrder.id}
                onToggleExpand={handleToggleExpand}
                onLoadComments={handleLoadComments}
                t={t}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
