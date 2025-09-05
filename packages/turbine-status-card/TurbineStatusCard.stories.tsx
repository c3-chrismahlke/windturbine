import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import i18n from './src/i18n';
import { 
  TurbineStatusCard, 
  WorkOrdersCard, 
  PowerOutputCard, 
  SystemHealthCard 
} from './src';

// Create a theme for Storybook
const theme = createTheme();

// Individual card stories
const TurbineStatusMeta: Meta<typeof TurbineStatusCard> = {
  title: 'Analytics Cards/TurbineStatusCard',
  component: TurbineStatusCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={{ width: '400px' }}>
            <Story />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    activeTurbines: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Number of active turbines',
    },
    totalTurbines: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Total number of turbines',
    },
    uptimePercentage: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Custom uptime percentage (optional)',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
};

const WorkOrdersMeta: Meta<typeof WorkOrdersCard> = {
  title: 'Analytics Cards/WorkOrdersCard',
  component: WorkOrdersCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={{ width: '400px' }}>
            <Story />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    totalWorkOrders: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Total number of work orders',
    },
    openWorkOrders: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Number of open work orders',
    },
    inProgressWorkOrders: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Number of work orders in progress',
    },
    completionPercentage: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Custom completion percentage (optional)',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
};

const PowerOutputMeta: Meta<typeof PowerOutputCard> = {
  title: 'Analytics Cards/PowerOutputCard',
  component: PowerOutputCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={{ width: '400px' }}>
            <Story />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    avgPowerOutput: {
      control: { type: 'number', min: 0, max: 10000 },
      description: 'Average power output value',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
};

const SystemHealthMeta: Meta<typeof SystemHealthCard> = {
  title: 'Analytics Cards/SystemHealthCard',
  component: SystemHealthCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={{ width: '400px' }}>
            <Story />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    workOrderProgress: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Work order progress percentage',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
};

// Dashboard overview story
const DashboardMeta: Meta = {
  title: 'Analytics Cards/Dashboard Overview',
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={{ padding: '20px' }}>
            <Story />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    ),
  ],
};

export default TurbineStatusMeta;

// Turbine Status Card Stories
export const TurbineStatusDefault: StoryObj<typeof TurbineStatusCard> = {
  args: {
    activeTurbines: 8,
    totalTurbines: 10,
  },
};

export const TurbineStatusHighUptime: StoryObj<typeof TurbineStatusCard> = {
  args: {
    activeTurbines: 9,
    totalTurbines: 10,
  },
};

export const TurbineStatusLoading: StoryObj<typeof TurbineStatusCard> = {
  args: {
    activeTurbines: 0,
    totalTurbines: 0,
    loading: true,
  },
};

// Work Orders Card Stories
export const WorkOrdersDefault: StoryObj<typeof WorkOrdersCard> = {
  args: {
    totalWorkOrders: 25,
    openWorkOrders: 5,
    inProgressWorkOrders: 8,
  },
};

export const WorkOrdersHighCompletion: StoryObj<typeof WorkOrdersCard> = {
  args: {
    totalWorkOrders: 30,
    openWorkOrders: 2,
    inProgressWorkOrders: 3,
  },
};

export const WorkOrdersLoading: StoryObj<typeof WorkOrdersCard> = {
  args: {
    totalWorkOrders: 0,
    openWorkOrders: 0,
    inProgressWorkOrders: 0,
    loading: true,
  },
};

// Power Output Card Stories
export const PowerOutputDefault: StoryObj<typeof PowerOutputCard> = {
  args: {
    avgPowerOutput: 1250,
  },
};

export const PowerOutputHigh: StoryObj<typeof PowerOutputCard> = {
  args: {
    avgPowerOutput: 2500,
  },
};

export const PowerOutputLoading: StoryObj<typeof PowerOutputCard> = {
  args: {
    avgPowerOutput: 0,
    loading: true,
  },
};

// System Health Card Stories
export const SystemHealthDefault: StoryObj<typeof SystemHealthCard> = {
  args: {
    workOrderProgress: 75,
  },
};

export const SystemHealthHigh: StoryObj<typeof SystemHealthCard> = {
  args: {
    workOrderProgress: 95,
  },
};

export const SystemHealthLoading: StoryObj<typeof SystemHealthCard> = {
  args: {
    workOrderProgress: 0,
    loading: true,
  },
};

// Dashboard Overview Story
export const DashboardOverview: StoryObj = {
  render: () => (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
          <TurbineStatusCard
            activeTurbines={8}
            totalTurbines={10}
          />
          <WorkOrdersCard
            totalWorkOrders={25}
            openWorkOrders={5}
            inProgressWorkOrders={8}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 2 }}>
          <PowerOutputCard
            avgPowerOutput={1250}
          />
          <SystemHealthCard
            workOrderProgress={75}
          />
        </Box>
      </Stack>
    </Box>
  ),
};
