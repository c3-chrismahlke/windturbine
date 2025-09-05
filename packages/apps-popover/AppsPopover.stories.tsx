import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '@mui/material/Button';
import AppsPopover, { type AppCard } from './src/index';

const meta = {
  title: 'Components/AppsPopover',
  component: AppsPopover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AppsPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

const sample: AppCard[] = [
  { id: '1', title: 'Weather Card', subtitle: '3-day forecast', href: 'http://localhost:6006', iconSrc: '/globe.svg' },
  { id: '2', title: 'Weather API', subtitle: 'Data providers', href: 'http://localhost:6006', iconSrc: '/file.svg' },
  { id: '3', title: 'Cesium Map', subtitle: '3D Globe', href: 'http://localhost:6006', iconSrc: '/vercel.svg' },
  { id: '4', title: 'Hello World', subtitle: 'Component demo', href: 'http://localhost:6006', iconSrc: '/window.svg' },
];

export const Basic: Story = {
  render: () => (
    <AppsPopover trigger={<Button variant="outlined">Apps</Button>} items={sample} />
  ),
};


