import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SelectedTurbine = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
} | null;

type EditorState = {
  open: boolean;
  editing: SelectedTurbine & { manufacturer?: string; capacityKW?: number; active?: boolean } | null;
  error: string | null;
  busy: boolean;
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState: { selected: null as SelectedTurbine },
  reducers: {
    setSelected(state, action: PayloadAction<SelectedTurbine>) {
      state.selected = action.payload;
    },
  },
});

export const { setSelected } = selectionSlice.actions;

type TurbineOverrides = Record<string, Partial<{ name: string; latitude: number; longitude: number; manufacturer: string; capacityKW: number; active: boolean }>>;

const turbinesSlice = createSlice({
  name: 'turbines',
  initialState: { overrides: {} as TurbineOverrides },
  reducers: {
    upsertTurbineFields(
      state,
      action: PayloadAction<{ id: string; changes: Partial<{ name: string; latitude: number; longitude: number; manufacturer: string; capacityKW: number; active: boolean }> }>
    ) {
      const { id, changes } = action.payload;
      state.overrides[id] = { ...(state.overrides[id] || {}), ...changes };
    },
    clearTurbineOverride(state, action: PayloadAction<{ id: string }>) {
      delete state.overrides[action.payload.id];
    },
  },
});

export const { upsertTurbineFields, clearTurbineOverride } = turbinesSlice.actions;

const editorSlice = createSlice({
  name: 'editor',
  initialState: { open: false, editing: null, error: null, busy: false } as EditorState,
  reducers: {
    openEditor(state, action: PayloadAction<EditorState['editing']>) {
      state.open = true;
      state.editing = action.payload;
      state.error = null;
    },
    closeEditor(state) {
      state.open = false;
      state.editing = null;
      state.error = null;
      state.busy = false;
    },
    setEditorField(state, action: PayloadAction<{ key: keyof NonNullable<EditorState['editing']>; value: any }>) {
      if (!state.editing) return;
      (state.editing as any)[action.payload.key] = action.payload.value;
    },
    setEditorBusy(state, action: PayloadAction<boolean>) { state.busy = action.payload; },
    setEditorError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
  },
});

export const { openEditor, closeEditor, setEditorField, setEditorBusy, setEditorError } = editorSlice.actions;

export const store = configureStore({
  reducer: { selection: selectionSlice.reducer, editor: editorSlice.reducer, turbines: turbinesSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: client-side view of roles from NextAuth session
export type Role = 'admin' | 'manager' | 'operator' | 'technician' | 'viewer' | string;


