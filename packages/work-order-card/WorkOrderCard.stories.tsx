import type { Meta, StoryObj } from '@storybook/react';
import WorkOrderCard from './src/WorkOrderCard';
import type { WorkOrder, WorkOrderComment } from './src/WorkOrderCard';

const baseWorkOrder: WorkOrder = {
  id: 'wo-001',
  windTurbineId: 'turbine-001',
  title: 'Routine Maintenance Check',
  description: 'Perform scheduled maintenance on wind turbine including blade inspection, gearbox oil change, and electrical system check.',
  status: 'in_progress',
  priority: 'medium',
  assignedTo: 'John Smith',
  createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
};

const sampleComments: WorkOrderComment[] = [
  {
    id: 'comment-1',
    workOrderId: 'wo-001',
    userId: 'John Smith',
    content: 'Started the maintenance check. All initial inspections look good.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'comment-2',
    workOrderId: 'wo-001',
    userId: 'Sarah Johnson',
    content: 'Gearbox oil analysis completed. Results show normal wear patterns.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const meta: Meta<typeof WorkOrderCard> = {
  title: 'Work Orders/WorkOrderCard',
  component: WorkOrderCard,
  parameters: {
    docs: {
      description: {
        component: 'A work order card component that displays work order information with status indicators, priority colors, and expandable comments section.',
      },
    },
  },
  args: {
    workOrder: baseWorkOrder,
    comments: [],
    commentsLoading: false,
    expanded: false,
  },
  argTypes: {
    workOrder: {
      description: 'The work order data to display',
    },
    comments: {
      description: 'Array of comments for this work order',
    },
    commentsLoading: {
      control: 'boolean',
      description: 'Whether comments are currently loading',
    },
    expanded: {
      control: 'boolean',
      description: 'Whether the comments section is expanded',
    },
    onToggleExpand: {
      action: 'toggleExpand',
      description: 'Callback when expand/collapse is triggered',
    },
    onLoadComments: {
      action: 'loadComments',
      description: 'Callback to load comments for this work order',
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkOrderCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default work order card with medium priority and in-progress status.',
      },
    },
  },
};

export const HighPriority: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      priority: 'high',
      title: 'Critical Blade Repair',
      description: 'Urgent repair needed for damaged blade detected during inspection.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'High priority work order with critical status indicators.',
      },
    },
  },
};

export const CriticalPriority: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      priority: 'critical',
      status: 'open',
      title: 'Emergency Shutdown Required',
      description: 'Immediate shutdown required due to safety concerns. All personnel must evacuate the area.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical priority work order with emergency status.',
      },
    },
  },
};

export const Overdue: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      title: 'Overdue Maintenance',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days overdue
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Overdue work order showing overdue indicators and red styling.',
      },
    },
  },
};

export const Completed: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      status: 'closed',
      title: 'Completed Maintenance',
      resolvedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Completed work order with closed status and resolved date.',
      },
    },
  },
};

export const Unassigned: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      assignedTo: undefined,
      title: 'Unassigned Work Order',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Work order without an assigned technician.',
      },
    },
  },
};

export const WithComments: Story = {
  args: {
    workOrder: baseWorkOrder,
    comments: sampleComments,
    expanded: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Work order with comments section expanded showing conversation history.',
      },
    },
  },
};

export const CommentsLoading: Story = {
  args: {
    workOrder: baseWorkOrder,
    comments: [],
    commentsLoading: true,
    expanded: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Work order with comments section expanded and loading state.',
      },
    },
  },
};

export const LongDescription: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      title: 'Complex Multi-Phase Maintenance',
      description: 'This is a comprehensive maintenance procedure that includes multiple phases: initial inspection, component testing, lubrication, calibration, and final verification. The process requires specialized equipment and trained personnel. All safety protocols must be followed throughout the entire procedure.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Work order with a long description that gets truncated with ellipsis.',
      },
    },
  },
};

export const NoDescription: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      description: undefined,
      title: 'Simple Task',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Work order without a description field.',
      },
    },
  },
};

export const LowPriority: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      priority: 'low',
      status: 'open',
      title: 'Routine Documentation Update',
      description: 'Update maintenance logs and documentation.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Low priority work order with minimal visual emphasis.',
      },
    },
  },
};

export const Blocked: Story = {
  args: {
    workOrder: {
      ...baseWorkOrder,
      status: 'blocked',
      title: 'Blocked Maintenance Task',
      description: 'Maintenance blocked due to weather conditions and safety concerns.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Blocked work order showing blocked status with appropriate styling.',
      },
    },
  },
};
