# Custom Theme System Documentation

This document provides comprehensive guidance on the custom theme system in the Wind Turbine application, including how to customize themes and create new ones.

## Overview

The application supports three distinct themes:
- **Light Theme**: Clean, bright interface with blue accents
- **Dark Theme**: Dark interface with blue accents  
- **Energy Theme**: Professional green/blue color scheme inspired by energy companies like GE Renewable Energy, Vestas, and Siemens Gamesa

## Current Themes

### Light Theme
- **Primary Color**: Blue (`hsl(210, 98%, 42%)`)
- **Background**: Light gray (`hsl(0, 0%, 99%)`)
- **Text**: Dark gray (`hsl(220, 20%, 25%)`)
- **Style**: Clean, professional, high contrast

### Dark Theme
- **Primary Color**: Blue (`hsl(210, 98%, 42%)`)
- **Background**: Dark gray (`hsl(220, 35%, 3%)`)
- **Text**: Light gray (`hsl(0, 0%, 100%)`)
- **Style**: Modern, easy on the eyes, low light friendly

### Energy Theme (Custom)
- **Primary Color**: Green (`hsl(160, 100%, 60%)`) - representing sustainability
- **Secondary Color**: Blue (`hsl(210, 100%, 60%)`) - representing technology
- **Background**: Professional gray (`hsl(220, 25%, 8%)`)
- **Text**: High contrast for readability
- **Style**: Professional, energy industry focused, corporate branding

## Theme Architecture

### File Structure
```
src/shared-theme/
├── customTheme.ts          # Custom theme color definitions
├── themePrimitives.ts      # Core theme system with all themes
├── AppTheme.tsx           # Main theme provider component
└── README-CustomTheme.md  # This documentation
```

### Key Components
- **ColorModeProvider**: Manages theme state and persistence
- **ThemeToggle**: UI component for switching themes
- **getDesignTokens**: Function that generates theme tokens
- **Color Schemes**: Predefined color palettes for each theme

## Customizing Existing Themes

### 1. Modifying Colors

To change colors in an existing theme, edit the color definitions in `themePrimitives.ts`:

```typescript
// Example: Change primary color in default theme
export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  // ... other shades
  500: 'hsl(210, 98%, 42%)', // Change this to your desired color
  // ... other shades
};
```

### 2. Updating Typography

Modify typography in the `getDesignTokens` function:

```typescript
typography: {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '3rem',
    fontWeight: 700, // Change weight
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
  },
  // ... other typography styles
}
```

### 3. Adjusting Shadows

Customize shadows for depth and elevation:

```typescript
shadows: isDark 
  ? [
      'none',
      `0 4px 20px ${alpha(energyGreen[500], 0.25)}`, // Change color and opacity
      // ... other shadow levels
    ]
  : [
      'none',
      `0 4px 20px ${alpha(energyGreen[500], 0.12)}`,
      // ... other shadow levels
    ]
```

## Creating a New Theme

### Step 1: Define Color Palette

Create a new color palette in `customTheme.ts`:

```typescript
export const myCustomColors = {
  50: 'hsl(300, 100%, 97%)',   // Very light
  100: 'hsl(300, 100%, 94%)',  // Light
  200: 'hsl(300, 100%, 88%)',  // Lighter
  300: 'hsl(300, 100%, 80%)',  // Light
  400: 'hsl(300, 100%, 70%)',  // Medium
  500: 'hsl(300, 100%, 60%)',  // Primary
  600: 'hsl(300, 100%, 50%)',  // Darker
  700: 'hsl(300, 100%, 40%)',  // Dark
  800: 'hsl(300, 100%, 30%)',  // Very dark
  900: 'hsl(300, 100%, 20%)',  // Darkest
};
```

### Step 2: Create Design Tokens Function

Add a new function in `customTheme.ts`:

```typescript
export const getMyCustomDesignTokens = (mode: PaletteMode) => {
  const isDark = mode === 'dark';
  
  return {
    palette: {
      mode,
      primary: {
        light: myCustomColors[300],
        main: myCustomColors[500],
        dark: myCustomColors[700],
        contrastText: isDark ? '#ffffff' : '#000000',
      },
      // ... other palette colors
    },
    typography: {
      // ... typography settings
    },
    shape: {
      borderRadius: 12, // Custom border radius
    },
    shadows: [
      // ... custom shadows
    ],
  };
};
```

### Step 3: Update Theme Primitives

Modify `themePrimitives.ts` to include your new theme:

```typescript
import { getMyCustomDesignTokens } from './customTheme';

export const getDesignTokens = (mode: PaletteMode, themeType: 'default' | 'custom' | 'myCustom' = 'default') => {
  if (themeType === 'myCustom') {
    return getMyCustomDesignTokens(mode);
  }
  // ... existing logic
};
```

### Step 4: Update ColorModeProvider

Add your new theme to the Mode type and logic:

```typescript
type Mode = 'light' | 'dark' | 'custom' | 'myCustom';

const toggle = () => {
  setMode((m) => {
    let next: Mode;
    if (m === 'light') next = 'dark';
    else if (m === 'dark') next = 'custom';
    else if (m === 'custom') next = 'myCustom';
    else next = 'light';
    // ... rest of logic
  });
};
```

### Step 5: Update ThemeToggle

Add your new theme to the UI:

```typescript
<FormControlLabel 
  value="myCustom" 
  control={<Radio size="small" />} 
  label={
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      My Custom
      <Chip label="New" size="small" color="primary" />
    </Box>
  } 
/>
```

## Color Theory Guidelines

### HSL Color System
The themes use HSL (Hue, Saturation, Lightness) for better color manipulation:

```typescript
// Format: hsl(hue, saturation%, lightness%)
'hsl(160, 100%, 60%)' // Green with 100% saturation, 60% lightness
```

### Color Palette Structure
Each color palette should have 10 shades (50-900):
- **50-200**: Light shades for backgrounds and subtle elements
- **300-400**: Medium shades for borders and secondary elements
- **500**: Primary color for main actions and branding
- **600-700**: Darker shades for hover states and emphasis
- **800-900**: Darkest shades for text and high contrast elements

### Accessibility Considerations
- **Contrast Ratio**: Ensure at least 4.5:1 for normal text, 3:1 for large text
- **Color Blindness**: Test with color blindness simulators
- **High Contrast**: Provide sufficient contrast between text and backgrounds

## Testing Themes

### Manual Testing
1. Switch between all themes using the theme toggle
2. Verify colors change consistently across components
3. Check that text remains readable in all themes
4. Test theme persistence after page refresh

### Storybook Testing
1. Use the theme switcher in Storybook toolbar
2. Test all components in different themes
3. Verify internationalization works with all themes
4. Check RTL support with Arabic locale

### Automated Testing
```typescript
// Example test for theme switching
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { getDesignTokens } from '../themePrimitives';

test('custom theme applies correctly', () => {
  const theme = createTheme(getDesignTokens('light', 'custom'));
  render(
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
  
  // Test that custom theme colors are applied
  expect(screen.getByTestId('primary-button')).toHaveStyle({
    backgroundColor: 'hsl(160, 100%, 60%)'
  });
});
```

## Performance Considerations

### Theme Caching
Themes are cached using `useMemo` to prevent unnecessary recalculations:

```typescript
const theme = useMemo(() => {
  const themeType = mode === 'custom' ? 'custom' : 'default';
  const paletteMode = mode === 'custom' ? 'light' : mode;
  const designTokens = getDesignTokens(paletteMode, themeType);
  return createTheme(designTokens);
}, [mode, isRtl]);
```

### Bundle Size
- Keep color palettes focused and avoid excessive color variations
- Use CSS custom properties for dynamic theming when possible
- Consider code splitting for theme-specific components

## Troubleshooting

### Common Issues

1. **Theme not applying**: Check localStorage for saved preference
2. **Colors not updating**: Verify theme provider is wrapping components
3. **Storybook issues**: Ensure theme switcher is properly configured
4. **Build errors**: Check import paths and TypeScript types

### Debug Mode
Enable debug logging by adding to your component:

```typescript
const { mode } = useColorMode();
console.log('Current theme mode:', mode);
console.log('Theme tokens:', getDesignTokens('light', mode));
```

### Color Validation
Use online tools to validate your color choices:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors.co](https://coolors.co/) for color palette generation
- [Color Oracle](http://colororacle.org/) for color blindness testing

## Best Practices

### Design Principles
1. **Consistency**: Use the same color palette throughout the application
2. **Hierarchy**: Use color intensity to create visual hierarchy
3. **Accessibility**: Ensure sufficient contrast and color-blind friendly palettes
4. **Branding**: Align colors with your company or product branding

### Code Organization
1. **Separation of Concerns**: Keep color definitions separate from component logic
2. **Reusability**: Create reusable color palettes that can be shared
3. **Documentation**: Document color choices and their intended use
4. **Version Control**: Track theme changes in version control

### Maintenance
1. **Regular Reviews**: Periodically review and update color palettes
2. **User Feedback**: Collect feedback on theme usability and accessibility
3. **Performance Monitoring**: Monitor theme switching performance
4. **Testing**: Maintain comprehensive test coverage for theme functionality

## Examples

### Energy Company Theme (Current Custom)
Inspired by GE Renewable Energy, Vestas, and Siemens Gamesa:
- **Green Primary**: Represents sustainability and renewable energy
- **Blue Secondary**: Represents technology and reliability
- **Professional Gray**: Clean, corporate aesthetic
- **High Contrast**: Ensures readability in industrial environments

### Healthcare Theme Example
```typescript
export const healthcareColors = {
  primary: 'hsl(200, 100%, 50%)',    // Medical blue
  secondary: 'hsl(120, 60%, 50%)',   // Health green
  accent: 'hsl(0, 70%, 60%)',        // Alert red
  neutral: 'hsl(220, 20%, 50%)',     // Professional gray
};
```

### Financial Theme Example
```typescript
export const financialColors = {
  primary: 'hsl(220, 100%, 50%)',    // Trust blue
  secondary: 'hsl(120, 50%, 40%)',   // Growth green
  accent: 'hsl(0, 70%, 50%)',        // Risk red
  neutral: 'hsl(0, 0%, 20%)',        // Professional black
};
```

This comprehensive guide should help you understand, customize, and extend the theme system in your Wind Turbine application. For additional support or questions, refer to the Material-UI theming documentation or create an issue in the project repository.
