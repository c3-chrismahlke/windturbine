import type { Meta, StoryObj } from '@storybook/react';
import TurbineDetailsCard from './src/TurbineDetailsCard';
import type { WindTurbine } from './src/TurbineDetailsCard';

const baseTurbine: WindTurbine = {
  id: 'turbine-001',
  name: 'Wind Farm Alpha - Turbine 1',
  latitude: 39.8283,
  longitude: -98.5795,
  manufacturer: {
    name: 'Vestas',
    country: 'Denmark',
  },
  builtDate: '2020-03-15',
  installationDate: '2020-05-20',
  active: true,
  ratedCapacityKW: 3000,
  createdAt: '2020-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
};

const samplePowerData = [
  1200, 1350, 1280, 1420, 1380, 1550, 1620, 1580, 1450, 1320,
  1480, 1650, 1720, 1680, 1550, 1420, 1380, 1450, 1520, 1680,
  1750, 1820, 1780, 1650, 1520, 1480, 1550, 1620, 1680, 1750,
  1820, 1880, 1850, 1720, 1580, 1450, 1520, 1680, 1750, 1820,
  1880, 1950, 1920, 1780, 1650, 1520, 1580, 1750, 1820, 1880,
  1950, 2020, 1980, 1850, 1720, 1580, 1650, 1820, 1880, 1950,
];

const meta: Meta<typeof TurbineDetailsCard> = {
  title: 'Turbine/TurbineDetailsCard',
  component: TurbineDetailsCard,
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive turbine details card that displays real-time power data, system information, and maintenance history with a beautiful mini bar chart visualization.',
      },
    },
  },
  args: {
    selectedId: 'turbine-001',
    height: '100%',
    turbine: baseTurbine,
    loading: false,
    powerData: samplePowerData,
  },
  argTypes: {
    selectedId: {
      control: 'text',
      description: 'The ID of the selected turbine',
    },
    height: {
      control: 'text',
      description: 'Height of the card component',
    },
    turbine: {
      description: 'The turbine data to display',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
    powerData: {
      description: 'Array of power output values for the mini bar chart',
    },
    onCopyId: {
      action: 'copyId',
      description: 'Callback when the copy ID button is clicked',
    },
    children: {
      description: 'Additional content to display (e.g., work orders)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TurbineDetailsCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default turbine details card with active status and sample power data showing an upward trend.',
      },
    },
  },
};

export const Inactive: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      active: false,
      name: 'Wind Farm Beta - Turbine 2',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Inactive turbine showing inactive status chip and no power output.',
      },
    },
  },
};

export const HighPowerOutput: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      name: 'Wind Farm Gamma - Turbine 3',
      ratedCapacityKW: 5000,
    },
    powerData: [
      4200, 4350, 4280, 4420, 4380, 4550, 4620, 4580, 4450, 4320,
      4480, 4650, 4720, 4680, 4550, 4420, 4380, 4450, 4520, 4680,
      4750, 4820, 4780, 4650, 4520, 4480, 4550, 4620, 4680, 4750,
      4820, 4880, 4850, 4720, 4580, 4450, 4520, 4680, 4750, 4820,
      4880, 4950, 4920, 4780, 4650, 4520, 4580, 4750, 4820, 4880,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'High-capacity turbine with high power output showing near-rated capacity utilization.',
      },
    },
  },
};

export const DecliningPower: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      name: 'Wind Farm Delta - Turbine 4',
    },
    powerData: [
      2800, 2750, 2680, 2520, 2380, 2250, 2120, 1980, 1850, 1720,
      1580, 1450, 1320, 1180, 1050, 920, 880, 750, 620, 580,
      450, 320, 280, 150, 120, 80, 50, 20, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine with declining power output showing a downward trend and eventual shutdown.',
      },
    },
  },
};

export const VolatilePower: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      name: 'Wind Farm Epsilon - Turbine 5',
    },
    powerData: [
      800, 1200, 600, 1500, 400, 1800, 200, 1600, 900, 1300,
      700, 1400, 500, 1700, 300, 1900, 100, 1500, 1100, 1200,
      800, 1600, 400, 1800, 600, 1400, 200, 1700, 900, 1300,
      700, 1500, 500, 1600, 300, 1800, 100, 1400, 1100, 1200,
      800, 1500, 400, 1700, 600, 1300, 200, 1600, 900, 1400,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine with volatile power output showing fluctuating performance patterns.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    turbine: undefined,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders for all content areas.',
      },
    },
  },
};

export const NoSelection: Story = {
  args: {
    turbine: null,
    loading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no turbine is selected, prompting user to select one.',
      },
    },
  },
};

export const DifferentManufacturer: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      name: 'Wind Farm Zeta - Turbine 6',
      manufacturer: {
        name: 'Siemens Gamesa',
        country: 'Spain',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine from a different manufacturer showing varied manufacturer information.',
      },
    },
  },
};

export const OldTurbine: Story = {
  args: {
    turbine: {
      ...baseTurbine,
      name: 'Wind Farm Eta - Turbine 7',
      builtDate: '2010-06-10',
      installationDate: '2010-08-15',
      ratedCapacityKW: 1500,
      updatedAt: '2023-12-01T08:15:00Z',
    },
    powerData: [
      800, 850, 780, 920, 880, 950, 1020, 980, 850, 720,
      880, 1050, 1120, 1080, 950, 820, 780, 850, 920, 1080,
      1150, 1220, 1180, 1050, 920, 880, 950, 1020, 1080, 1150,
      1220, 1280, 1250, 1120, 980, 850, 920, 1080, 1150, 1220,
      1280, 1350, 1320, 1180, 1050, 920, 980, 1150, 1220, 1280,
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Older, lower-capacity turbine with historical installation dates.',
      },
    },
  },
};

export const WithWorkOrders: Story = {
  args: {
    turbine: baseTurbine,
    powerData: samplePowerData,
    children: (
      <div style={{ padding: '8px', border: '1px dashed #ccc', borderRadius: '4px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#666' }}>Work Orders Section</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
          This would typically contain the WorkOrdersList component
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine details card with additional content (work orders) in the children section.',
      },
    },
  },
};

export const NoPowerData: Story = {
  args: {
    turbine: baseTurbine,
    powerData: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine with no power data available, showing empty state in the power visualization.',
      },
    },
  },
};

export const SingleDataPoint: Story = {
  args: {
    turbine: baseTurbine,
    powerData: [1500],
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine with only a single power data point, showing minimal bar chart.',
      },
    },
  },
};

export const CustomHeight: Story = {
  args: {
    turbine: baseTurbine,
    powerData: samplePowerData,
    height: '600px',
  },
  parameters: {
    docs: {
      description: {
        story: 'Turbine details card with custom height setting.',
      },
    },
  },
};
