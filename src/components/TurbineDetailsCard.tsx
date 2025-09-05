import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '@lib/store';

import { useTurbineStream } from '@lib/useTurbineStream';
import type { WindTurbine } from '@models/WindTurbine';
import { apiFetch } from '@lib/api';
import { TurbineDetailsCard as TurbineDetailsCardPackage, type WindTurbine as PackageWindTurbine } from '@your-scope/turbine-details-card';
import WorkOrdersList from '@components/WorkOrdersList';

type Props = {
  selectedId?: string | null;
  height?: number | string;
  /** Editing disabled */
};

/**
 * TurbineDetailsCard — Wrapper component that integrates the package component
 * with the main application's data fetching and state management.
 */
export default function TurbineDetailsCard({
  selectedId,
  height = '100%',
}: Props) {
  const { t } = useTranslation('common');
  const id = selectedId ?? undefined;

  // ----------------- Data fetching (from original component) -----------------
  const { data } = useTurbineStream(id ? [id] : [], 1);
  const [selected, setSelected] = React.useState<WindTurbine | null>(null);
  const [loadingSelected, setLoadingSelected] = React.useState(false);
  
  const fetchSelected = React.useCallback(async () => {
    let ok = true;
    try {
      if (!id) { setSelected(null); setLoadingSelected(false); return; }
      setLoadingSelected(true);
      const res = await apiFetch<WindTurbine | { data?: WindTurbine }>(`/1/windturbines/${id}`);
      const item = (res as { data?: WindTurbine } | WindTurbine | undefined);
      const tur = (item && 'data' in item ? item.data : (item as WindTurbine | undefined)) ?? null;
      setSelected(tur ?? null);
    } catch {
      ok = false;
      setSelected(null);
    } finally {
      setLoadingSelected(false);
    }
    return ok;
  }, [id]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => { if (!cancelled) await fetchSelected(); })();
    return () => { cancelled = true; };
  }, [fetchSelected]);

  // Refresh when an edit/delete event occurs for the current turbine
  React.useEffect(() => {
    const onUpdated = (e: Event) => {
      const det = (e as CustomEvent<{ id?: string; name?: string; latitude?: number; longitude?: number; manufacturer?: string; capacityKW?: number; active?: boolean }>).detail;
      if (!det?.id || det.id !== id) return;
      setSelected((prev) => {
        if (!prev) return prev;
        const next = { ...prev } as WindTurbine;
        if (typeof det.name === 'string') next.name = det.name;
        if (typeof det.latitude === 'number') next.latitude = det.latitude;
        if (typeof det.longitude === 'number') next.longitude = det.longitude;
        if (typeof det.active === 'boolean') (next as any).active = det.active;
        if (typeof det.capacityKW === 'number') (next as any).ratedCapacityKW = det.capacityKW;
        if (typeof det.manufacturer === 'string') next.manufacturer = { ...(next.manufacturer || { name: '', country: '' }), name: det.manufacturer } as any;
        return next;
      });
    };
    const onDeleted = (e: Event) => {
      const det = (e as CustomEvent<{ id?: string }>).detail;
      if (!det?.id || det.id !== id) return;
      setSelected(null);
    };
    window.addEventListener('turbine:updated', onUpdated as EventListener);
    window.addEventListener('turbine:deleted', onDeleted as EventListener);
    return () => {
      window.removeEventListener('turbine:updated', onUpdated as EventListener);
      window.removeEventListener('turbine:deleted', onDeleted as EventListener);
    };
  }, [id, fetchSelected]);

  const [series, setSeries] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSeries([]);
  }, [id]);
  React.useEffect(() => {
    const arr = Array.isArray(data) ? data : data ? [data] : [];
    if (!arr.length) return;
    const latest = arr[arr.length - 1]?.powerKW;
    if (typeof latest === 'number') setSeries((prev) => [...prev.slice(-59), latest]);
  }, [data]);

  // Apply transient Redux overrides (edited fields) without re-fetch
  const tdOverrides = useSelector((s: RootState) => (s as any).turbines?.overrides?.[id ?? ''] || {}) as Partial<{ name: string; latitude: number; longitude: number; manufacturer: string; capacityKW: number; active: boolean }>;
  const effective = React.useMemo(() => {
    if (!selected) return null;
    const merged = { ...selected } as WindTurbine;
    if (typeof tdOverrides.name === 'string') merged.name = tdOverrides.name as string;
    if (typeof tdOverrides.latitude === 'number') merged.latitude = tdOverrides.latitude as number;
    if (typeof tdOverrides.longitude === 'number') merged.longitude = tdOverrides.longitude as number;
    if (typeof tdOverrides.active === 'boolean') (merged as any).active = tdOverrides.active as boolean;
    if (typeof tdOverrides.capacityKW === 'number') (merged as any).ratedCapacityKW = tdOverrides.capacityKW as number;
    if (typeof tdOverrides.manufacturer === 'string') merged.manufacturer = { ...(merged.manufacturer || { name: '', country: '' }), name: tdOverrides.manufacturer } as any;
    return merged;
  }, [selected, tdOverrides]);

  // Convert to package format
  const packageTurbine: PackageWindTurbine | null = effective ? {
    id: effective.id,
    name: effective.name,
    latitude: effective.latitude,
    longitude: effective.longitude,
    manufacturer: effective.manufacturer,
    builtDate: effective.builtDate,
    installationDate: effective.installationDate,
    active: effective.active,
    ratedCapacityKW: effective.ratedCapacityKW,
    createdAt: effective.createdAt,
    updatedAt: effective.updatedAt,
  } : null;

  const handleCopyId = React.useCallback(async (turbineId: string) => {
    try {
      await navigator.clipboard.writeText(turbineId);
    } catch {
      // Ignore clipboard errors
    }
  }, []);

  return (
    <TurbineDetailsCardPackage
      selectedId={selectedId}
      height={height}
      turbine={packageTurbine}
      loading={loadingSelected}
      powerData={series}
      onCopyId={handleCopyId}
      t={t}
    >
      {/* Work Orders Section */}
      <div>
        <WorkOrdersList height={'100%'} turbineId={selected?.id} />
      </div>
    </TurbineDetailsCardPackage>
  );
}
