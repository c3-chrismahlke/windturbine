import * as React from 'react';
import Box from '@mui/material/Box';
import AppsPopoverPkg, { type AppCard as AppsPopoverCard } from '@your-scope/apps-popover';

const items: AppsPopoverCard[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    subtitle: 'Component demo',
    href: 'http://localhost:6006/?path=/story/hello-world--default',
    iconSrc: '/window.svg',
  },
  {
    id: 'weather-card',
    title: 'Weather Card',
    subtitle: '3‑day forecast',
    href: 'http://localhost:6006/?path=/story/weather-weather3daycard--default',
    iconSrc: '/globe.svg',
  },
  {
    id: 'work-order-card',
    title: 'Work Order Card',
    subtitle: 'Individual work order',
    href: 'http://localhost:6007/?path=/story/turbine-workordercard--default',
    iconSrc: '/file.svg',
  },
  {
    id: 'turbine-details-card',
    title: 'Turbine Details Card',
    subtitle: 'Turbine information',
    href: 'http://localhost:6008/?path=/story/turbine-turbinedetailscard--default',
    iconSrc: '/file.svg',
  },
  {
    id: 'turbine-edit-dialog',
    title: 'Turbine Edit Dialog',
    subtitle: 'Edit turbine form',
    href: 'http://localhost:7010/?path=/story/turbine-turbineeditdialog--default',
    iconSrc: '/file.svg',
  },
  {
    id: 'weather-api',
    title: 'Weather API',
    subtitle: 'Data providers',
    href: 'http://localhost:6006',
    iconSrc: '/file.svg',
  },
  {
    id: 'platform-ui',
    title: 'Platform UI',
    subtitle: 'Shared theme',
    href: 'http://localhost:6006',
    iconSrc: '/next.svg',
  },
  {
    id: 'map',
    title: 'Mapbox',
    subtitle: '3D Globe',
    href: 'http://localhost:6006',
    iconSrc: '/vercel.svg',
  },
  {
    id: 'work-orders',
    title: 'Work Orders',
    subtitle: 'Streaming list',
    href: 'http://localhost:6006',
    iconSrc: '/file.svg',
  },
];

export default function AppsPopover({ children }: { children: React.ReactNode }) {
  return <AppsPopoverPkg trigger={<Box>{children}</Box>} items={items} />;
}
