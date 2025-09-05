import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@lib/store';
import {
  closeEditor,
  setEditorField,
  setEditorBusy,
  setEditorError,
  setSelected,
} from '@lib/store';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@lib/api';
import { upsertTurbineFields } from '@lib/store';
import { TurbineEditDialog as TurbineEditDialogPackage, type EditorShape } from '@your-scope/turbine-edit-dialog';

export default function TurbineEditDialog() {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { open, editing, busy, error } = useSelector(
    (s: RootState) =>
      (s as any).editor as { open: boolean; editing: EditorShape | null; busy: boolean; error: string | null }
  );

  const onClose = () => dispatch(closeEditor());

  const isCreating = !editing?.id || editing.id === '';

  const onSave = async (data: EditorShape) => {
    dispatch(setEditorBusy(true));
    dispatch(setEditorError(null));
    
    try {
      const payload = {
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        active: !!data.active,
        ratedCapacityKW: data.capacityKW,
        manufacturer: {
          name: data.manufacturer,
          country: data.manufacturerCountry || undefined,
        },
        builtDate: data.builtDate || undefined,
        installationDate: data.installationDate || undefined,
      } as any;

      let response;
      if (isCreating) {
        // Create new turbine
        response = await apiFetch(`/1/windturbines`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else {
        // Update existing turbine
        try {
          response = await apiFetch(`/1/windturbines/${data.id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
          });
        } catch {
          response = await apiFetch(`/1/windturbines/${data.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
        }
      }

      // Get the turbine ID from response (for new turbines) or use existing ID
      const turbineId = isCreating ? (response as any)?.id || data.id : data.id;

      try {
        if (isCreating) {
          // Dispatch creation event
          window.dispatchEvent(
            new CustomEvent('turbine:created', {
              detail: {
                id: turbineId,
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                manufacturer: data.manufacturer,
                capacityKW: data.capacityKW,
                active: data.active,
              },
            })
          );
        } else {
          // Dispatch update event
          window.dispatchEvent(
            new CustomEvent('turbine:updated', {
              detail: {
                id: turbineId,
                name: data.name,
                latitude: data.latitude,
                longitude: data.longitude,
                manufacturer: data.manufacturer,
                capacityKW: data.capacityKW,
                active: data.active,
              },
            })
          );
        }
      } catch {
        // Ignore event dispatch errors
      }

      // Redux: cache the edited fields for local UI consumers
      dispatch(
        upsertTurbineFields({
          id: turbineId,
          changes: {
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            manufacturer: data.manufacturer,
            capacityKW: data.capacityKW,
            active: data.active,
          },
        })
      );

      if (
        typeof data.name === 'string' &&
        typeof data.latitude === 'number' &&
        typeof data.longitude === 'number'
      ) {
        dispatch(
          setSelected({
            id: turbineId,
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
          })
        );
      }

      dispatch(closeEditor());
    } catch (e) {
      const msg = e instanceof Error ? e.message : 
        (isCreating ? t('turbineEdit.errors.failedToCreate') : t('turbineEdit.errors.failedToSave'));
      dispatch(setEditorError(msg));
      throw e; // Re-throw so the package can handle the error display
    } finally {
      dispatch(setEditorBusy(false));
    }
  };

  const onDelete = async (id: string) => {
    if (isCreating) {
      // If we're creating, just close the dialog
      dispatch(closeEditor());
      return;
    }

    dispatch(setEditorBusy(true));
    dispatch(setEditorError(null));
    
    try {
      await apiFetch(`/1/windturbines/${id}`, { method: 'DELETE' });
      try {
        window.dispatchEvent(new CustomEvent('turbine:deleted', { detail: { id } }));
      } catch {
        // Ignore event dispatch errors
      }
      
      dispatch(setSelected(null));
      dispatch(closeEditor());
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('turbineEdit.errors.failedToDelete');
      dispatch(setEditorError(msg));
      throw e; // Re-throw so the package can handle the error display
    } finally {
      dispatch(setEditorBusy(false));
    }
  };

  const onFieldChange = (key: keyof EditorShape, value: any) => {
    dispatch(setEditorField({ key: key as any, value }));
  };

  return (
    <TurbineEditDialogPackage
      open={open}
      editing={editing}
      busy={busy}
      error={error}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
      onFieldChange={onFieldChange}
      t={t}
      isCreating={isCreating}
    />
  );
}
