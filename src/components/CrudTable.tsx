import * as React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSelected, openEditor } from '@lib/store';
import { useTranslation } from 'react-i18next';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useSession } from 'next-auth/react';
import type { WindTurbine, PaginatedResponse } from '@models/WindTurbine';
import { apiFetch } from '@lib/api';
import { useTurbineStream, type PowerReading } from '@lib/useTurbineStream';
import TurbineEditDialog from '@components/TurbineEditDialog';

type LiveRow = {
  id: string;
  name: string;
  manufacturer: string;
  capacityKW: number;
  active: boolean;
  latitude: number;
  longitude: number;
  latestPowerKW?: number;
  lastUpdated?: string;
};

export default function CrudTable({ onSelect }: { onSelect?: (row: { id: string; name: string; latitude: number; longitude: number }) => void }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('common');
  const { data: session } = useSession();
  const [rows, setRows] = React.useState<LiveRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Check if user can edit turbines (Admin or Technician roles)
  const userRoles = (session?.user as { roles?: string[] })?.roles || [];
  const canEditTurbines = userRoles.includes('admin') || userRoles.includes('technician');

  // Function to load turbines - load ALL turbines to match the map
  const loadTurbines = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all: WindTurbine[] = [];
      let page = 1;
      const limit = 500;
      for (;;) {
        const data = await apiFetch<PaginatedResponse<WindTurbine> | WindTurbine[]>(`/1/windturbines?limit=${limit}&page=${page}`);
        const items: WindTurbine[] | undefined = Array.isArray(data)
          ? (data as WindTurbine[])
          : (data?.data as WindTurbine[] | undefined);
        if (items?.length) all.push(...items);
        const hasNextFromApi = !Array.isArray(data)
          ? Boolean((data as PaginatedResponse<WindTurbine> | undefined)?.pagination?.hasNext)
          : undefined;
        const hasNext = hasNextFromApi ?? (items ? items.length === limit : false);
        if (!hasNext) break;
        page += 1;
      }
      
      const mappedRows = all.map((t) => ({
        id: t.id,
        name: t.name,
        manufacturer: t.manufacturer?.name ?? '',
        capacityKW: t.ratedCapacityKW,
        active: t.active,
        latitude: t.latitude,
        longitude: t.longitude,
      }));
      
      console.log(`Loaded ${mappedRows.length} turbines for table`);
      setRows(mappedRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: fetch all turbines (paged)
  React.useEffect(() => {
    loadTurbines();
  }, [loadTurbines]);

  // Subscribe to live stream and merge into rows
  const idsForStream = React.useMemo(() => rows.map((r) => r.id).slice(0, 50), [rows]);
  const { data: streamData } = useTurbineStream(idsForStream, 5);
  const getReadingId = (obj: unknown): string | undefined => {
    const r = obj as { turbineId?: string; windTurbineId?: string; id?: string };
    return r?.turbineId ?? r?.windTurbineId ?? r?.id;
  };
  
  React.useEffect(() => {
    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail as { 
        id: string; 
        name: string; 
        latitude: number; 
        longitude: number; 
        manufacturer: string; 
        capacityKW: number; 
        active: boolean; 
      };
      
      if (detail?.id) {
        console.log('Turbine updated event received:', detail);
        setRows((prev) =>
          prev.map((row) => 
            row.id === detail.id 
              ? { 
                  ...row, 
                  name: detail.name,
                  latitude: detail.latitude,
                  longitude: detail.longitude,
                  manufacturer: detail.manufacturer,
                  capacityKW: detail.capacityKW,
                  active: detail.active,
                }
              : row
          )
        );
      }
    };

    const onCreated = (e: Event) => {
      const detail = (e as CustomEvent).detail as { 
        id: string; 
        name: string; 
        latitude: number; 
        longitude: number; 
        manufacturer: string; 
        capacityKW: number; 
        active: boolean; 
      };
      
      if (detail?.id) {
        console.log('Turbine created event received:', detail);
        setRows((prev) => [
          ...prev,
          {
            id: detail.id,
            name: detail.name,
            manufacturer: detail.manufacturer,
            capacityKW: detail.capacityKW,
            active: detail.active,
            latitude: detail.latitude,
            longitude: detail.longitude,
          }
        ]);
      }
    };

    const onDeleted = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: string };
      if (detail?.id) {
        console.log('Turbine deleted event received:', detail.id);
        setRows((prev) => prev.filter(row => row.id !== detail.id));
      }
    };

    window.addEventListener('turbine:updated', onUpdated);
    window.addEventListener('turbine:created', onCreated);
    window.addEventListener('turbine:deleted', onDeleted);
    
    return () => {
      window.removeEventListener('turbine:updated', onUpdated);
      window.removeEventListener('turbine:created', onCreated);
      window.removeEventListener('turbine:deleted', onDeleted);
    };
  }, []);

  // Merge live stream data into rows
  React.useEffect(() => {
    if (!streamData?.length) return;
    const updates = new Map<string, Partial<LiveRow>>();
    for (const reading of streamData) {
      const id = getReadingId(reading);
      if (!id) continue;
      const existing = updates.get(id) || {};
      updates.set(id, {
        ...existing,
        latestPowerKW: (reading as PowerReading).powerKW,
        lastUpdated: new Date().toISOString(),
      });
    }
    if (updates.size) {
      setRows((prev) =>
        prev.map((row) => {
          const update = updates.get(row.id);
          return update ? { ...row, ...update } : row;
        })
      );
    }
  }, [streamData]);

  const handleAddTurbine = () => {
    if (!canEditTurbines) return;
    
    // Create a new turbine object for editing
    const newTurbine = {
      id: '', // Will be generated by the backend
      name: '',
      latitude: 0,
      longitude: 0,
      manufacturer: '',
      capacityKW: 0,
      active: true,
    };
    
    dispatch(openEditor(newTurbine));
  };

  const handleEditTurbine = (id: string) => {
    if (!canEditTurbines) return;
    
    const turbine = rows.find(r => r.id === id);
    if (!turbine) return;
    
    const editData = {
      id: turbine.id,
      name: turbine.name,
      latitude: turbine.latitude,
      longitude: turbine.longitude,
      manufacturer: turbine.manufacturer,
      capacityKW: turbine.capacityKW,
      active: turbine.active,
    };
    
    dispatch(openEditor(editData));
  };

  const handleRowClick = (params: any) => {
    const row = params.row as LiveRow;
    
    console.log('Table row clicked:', {
      id: row.id,
      name: row.name,
      latitude: row.latitude,
      longitude: row.longitude,
      rowIndex: params.id,
      totalRows: rows.length
    });
    
    // Validate that we have valid coordinates
    if (typeof row.latitude !== 'number' || typeof row.longitude !== 'number') {
      console.warn('Invalid coordinates for turbine:', row.id, 'lat:', row.latitude, 'lng:', row.longitude);
      return;
    }
    
    // Check for reasonable coordinate ranges
    if (row.latitude < -90 || row.latitude > 90 || row.longitude < -180 || row.longitude > 180) {
      console.warn('Coordinates out of valid range for turbine:', row.id, 'lat:', row.latitude, 'lng:', row.longitude);
      return;
    }
    
    const payload = { 
      id: row.id, 
      name: row.name, 
      latitude: row.latitude, 
      longitude: row.longitude 
    };
    
    console.log('Dispatching turbine selection:', payload);
    onSelect?.(payload);
    dispatch(setSelected(payload));
  };

  const columns: GridColDef<LiveRow>[] = [
    {
      field: 'name',
      headerName: t('table.name'),
      width: 200,
      flex: 1,
    },
    {
      field: 'manufacturer',
      headerName: t('table.manufacturer'),
      width: 150,
    },
    {
      field: 'capacityKW',
      headerName: t('table.capacity'),
      width: 120,
      type: 'number',
    },
    {
      field: 'latestPowerKW',
      headerName: t('table.liveOutput'),
      width: 140,
      type: 'number',
      renderCell: (params) => {
        const value = params.value as number | undefined;
        return value !== undefined ? `${value.toFixed(1)} kW` : '—';
      },
    },
    {
      field: 'active',
      headerName: t('table.status'),
      width: 100,
      type: 'boolean',
      renderCell: (params) => (params.value ? t('table.active') : t('table.inactive')),
    },
    ...(canEditTurbines ? [{
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 60,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditRoundedIcon />}
          label={t('table.edit')}
          onClick={() => handleEditTurbine(params.id as string)}
        />,
      ],
    }] : []),
  ];

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      minHeight: 0, // Important for proper height calculation
      position: 'relative',
    }}>
      {/* Add Turbine Button - Smaller Icon */}
      {canEditTurbines && (
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12, 
          zIndex: 1,
        }}>
          <Tooltip title={t('table.addTurbine')}>
            <IconButton
              size="small"
              color="primary"
              onClick={handleAddTurbine}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  boxShadow: 4,
                },
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <DataGrid<LiveRow>
        key={i18n.language}
        loading={loading}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        pageSizeOptions={[10, 25, 50, 100]}
        pagination
        autoPageSize={false}
        sx={{ 
          height: 600, // Fixed height instead of 100%
          width: '100%',
          borderRadius: 0,
          '& .MuiDataGrid-row': {
            cursor: canEditTurbines ? 'pointer' : 'default',
            '&:hover': {
              backgroundColor: canEditTurbines ? 'action.hover' : 'transparent',
            },
          },
          '& .MuiDataGrid-cell': {
            '&:focus': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-footerContainer': {
            minHeight: '52px', // Ensure footer has enough space for pagination
          },
        }}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
      />
      {error ? <div role="alert" style={{ color: '#b71c1c' }}>{error}</div> : null}

      <TurbineEditDialog />
    </Box>
  );
}
