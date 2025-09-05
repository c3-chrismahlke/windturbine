# Turbine Status Card

A reusable React component for displaying turbine status metrics in analytics dashboards.

## Features

- 📊 Displays active vs total turbines
- 📈 Shows uptime percentage with animated progress bar
- 🎨 Material-UI theming support
- 🌍 Internationalization (i18n) support
- ⚡ Loading and error states
- 🎛️ Customizable styling with sx prop
- 📱 Responsive design

## Installation

```bash
npm install @your-scope/turbine-status-card
```

## Usage

```tsx
import { TurbineStatusCard } from '@your-scope/turbine-status-card';

function MyComponent() {
  return (
    <TurbineStatusCard
      activeTurbines={8}
      totalTurbines={10}
      uptimePercentage={85.5} // Optional
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeTurbines` | `number` | - | Number of active turbines |
| `totalTurbines` | `number` | - | Total number of turbines |
| `uptimePercentage` | `number` | - | Custom uptime percentage (optional) |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `boolean` | `false` | Show error state |
| `className` | `string` | - | Custom CSS class |
| `sx` | `object` | - | Material-UI sx prop for styling |

## Examples

### Basic Usage
```tsx
<TurbineStatusCard
  activeTurbines={8}
  totalTurbines={10}
/>
```

### With Custom Uptime
```tsx
<TurbineStatusCard
  activeTurbines={5}
  totalTurbines={10}
  uptimePercentage={85.5}
/>
```

### Loading State
```tsx
<TurbineStatusCard
  activeTurbines={0}
  totalTurbines={0}
  loading={true}
/>
```

### Error State
```tsx
<TurbineStatusCard
  activeTurbines={0}
  totalTurbines={0}
  error={true}
/>
```

## Styling

The component uses Material-UI's theming system and supports custom styling via the `sx` prop:

```tsx
<TurbineStatusCard
  activeTurbines={8}
  totalTurbines={10}
  sx={{
    maxWidth: 400,
    margin: 2,
  }}
/>
```

## Internationalization

The component supports multiple languages through react-i18next. Make sure to provide the required translation keys in your i18n configuration:

```json
{
  "analytics": {
    "turbineStatus": {
      "title": "Turbine Status",
      "total": "Total",
      "uptime": "Uptime"
    },
    "error": {
      "title": "Error loading data"
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev

# Clean build artifacts
npm run clean
```

## License

MIT
