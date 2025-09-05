import type { Meta, StoryObj } from '@storybook/react';
import TurbineEditDialog from './src/TurbineEditDialog';
import type { EditorShape } from './src/TurbineEditDialog';
import { useState } from 'react';

const baseTurbine: EditorShape = {
  id: 'turbine-001',
  name: 'Wind Farm Alpha - Turbine 1',
  latitude: 39.8283,
  longitude: -98.5795,
  manufacturer: 'Vestas',
  manufacturerCountry: 'Denmark',
  capacityKW: 3000,
  active: true,
  builtDate: '2020-03-15',
  installationDate: '2020-05-20',
};

const meta: Meta<typeof TurbineEditDialog> = {
  title: 'Turbine/TurbineEditDialog',
  component: TurbineEditDialog,
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive turbine edit dialog with form validation, date pickers, and a danger zone for destructive actions. Features organized sections for identity, location, specifications, and lifecycle data.',
      },
    },
  },
  args: {
    open: true,
    editing: baseTurbine,
    busy: false,
    error: null,
    onClose: () => {},
    onSave: async (data) => {
      console.log('Save turbine:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    },
    onDelete: async (id) => {
      console.log('Delete turbine:', id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    },
    onFieldChange: (key, value) => {
      console.log('Field change:', key, value);
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    editing: {
      description: 'The turbine data being edited',
    },
    busy: {
      control: 'boolean',
      description: 'Whether the dialog is in a busy/loading state',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    onClose: {
      action: 'close',
      description: 'Callback when the dialog is closed',
    },
    onSave: {
      action: 'save',
      description: 'Callback when the save button is clicked',
    },
    onDelete: {
      action: 'delete',
      description: 'Callback when the delete button is clicked',
    },
    onFieldChange: {
      action: 'fieldChange',
      description: 'Callback when a field value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TurbineEditDialog>;

// Wrapper component to handle state for interactive stories
function TurbineEditDialogWrapper(props: any) {
  const [open, setOpen] = useState(props.open);
  const [editing, setEditing] = useState(props.editing);
  const [busy, setBusy] = useState(props.busy);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleSave = async (data: EditorShape) => {
    setBusy(true);
    try {
      await props.onSave(data);
      setEditing(data);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      await props.onDelete(id);
      setOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleFieldChange = (key: keyof EditorShape, value: any) => {
    setEditing(prev => prev ? { ...prev, [key]: value } : null);
    props.onFieldChange(key, value);
  };

  return (
    <TurbineEditDialog
      {...props}
      open={open}
      editing={editing}
      busy={busy}
      onClose={handleClose}
      onSave={handleSave}
      onDelete={handleDelete}
      onFieldChange={handleFieldChange}
    />
  );
}

export const Default: Story = {
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Default turbine edit dialog with all fields populated and ready for editing.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    editing: {
      id: 'turbine-new',
      name: '',
      latitude: undefined,
      longitude: undefined,
      manufacturer: '',
      manufacturerCountry: '',
      capacityKW: undefined,
      active: false,
      builtDate: null,
      installationDate: null,
    },
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty turbine edit dialog for creating a new turbine with no pre-filled data.',
      },
    },
  },
};

export const Busy: Story = {
  args: {
    busy: true,
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog in busy state with loading indicators and disabled fields.',
      },
    },
  },
};

export const WithErrors: Story = {
  args: {
    editing: {
      id: 'turbine-001',
      name: '', // Invalid: empty name
      latitude: 200, // Invalid: out of range
      longitude: -200, // Invalid: out of range
      manufacturer: '', // Invalid: empty manufacturer
      manufacturerCountry: 'Denmark',
      capacityKW: -100, // Invalid: negative capacity
      active: true,
      builtDate: '2020-03-15',
      installationDate: '2020-01-01', // Invalid: before built date
    },
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog with validation errors showing field-level error messages.',
      },
    },
  },
};

export const WithApiError: Story = {
  args: {
    error: 'Failed to connect to the server. Please check your internet connection and try again.',
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog with an API error message displayed at the top.',
      },
    },
  },
};

export const InactiveTurbine: Story = {
  args: {
    editing: {
      ...baseTurbine,
      name: 'Wind Farm Beta - Turbine 2',
      active: false,
    },
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog for an inactive turbine with the active switch turned off.',
      },
    },
  },
};

export const OldTurbine: Story = {
  args: {
    editing: {
      ...baseTurbine,
      name: 'Wind Farm Gamma - Turbine 3',
      manufacturer: 'Siemens Gamesa',
      manufacturerCountry: 'Spain',
      capacityKW: 1500,
      builtDate: '2010-06-10',
      installationDate: '2010-08-15',
    },
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog for an older, lower-capacity turbine with historical dates.',
      },
    },
  },
};

export const MinimalData: Story = {
  args: {
    editing: {
      id: 'turbine-minimal',
      name: 'Minimal Turbine',
      latitude: 40.7128,
      longitude: -74.0060,
      manufacturer: 'Generic',
      capacityKW: 2000,
      active: true,
    },
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog with only the required fields filled out.',
      },
    },
  },
};

export const Closed: Story = {
  args: {
    open: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog in closed state (not visible).',
      },
    },
  },
};

export const NoData: Story = {
  args: {
    editing: null,
  },
  render: (args) => <TurbineEditDialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Turbine edit dialog with no turbine data (shows empty form).',
      },
    },
  },
};
