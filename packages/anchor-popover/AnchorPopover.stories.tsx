import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AnchorPopover from './src/index';

const meta = {
  title: 'Components/AnchorPopover',
  component: AnchorPopover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AnchorPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <AnchorPopover
      id="demo-pop"
      trigger={<Button variant="outlined">Open Popover</Button>}
      paperSx={{ p: 2, width: 300, mt: 2 }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Demo Popover</Typography>
        <Typography variant="body2">Reusable anchor-based popover content.</Typography>
      </Box>
    </AnchorPopover>
  ),
};


