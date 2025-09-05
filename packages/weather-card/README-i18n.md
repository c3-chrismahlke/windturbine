# Weather Card Internationalization Testing

This document explains how to test the internationalization (i18n) features of the Weather3DayCard component in Storybook.

## Features

The Weather3DayCard component supports internationalization with the following languages:
- **English** (en) - Default language
- **Spanish** (es) - Español
- **Chinese** (zh) - 中文
- **Arabic** (ar) - عربي

## Testing in Storybook

### 1. Locale Switcher

In Storybook, you'll find a **Locale** switcher in the toolbar (globe icon). This allows you to:
- Switch between different languages
- See real-time translation updates
- Test right-to-left (RTL) layout for Arabic

### 2. What Gets Translated

The following elements are automatically translated:
- **Card title**: "3‑Day Forecast" / "Pronóstico de 3 días" / "3天预报" / "توقعات 3 أيام"
- **Labels**: "Today", "Low", "Max wind", "Direction", "Precip", etc.
- **Wind classifications**: "Unknown wind", "Below cut‑in", "Cut‑out risk", "High wind", etc.
- **Units**: Temperature symbols (°C/°F), wind speed units (km/h, mph)
- **Compass directions**: N, NNE, NE, etc. (translated to local language)
- **Error messages**: API errors and validation messages
- **No data messages**: "No data" and "Weather data is temporarily unavailable"

### 3. Testing Different Scenarios

Use the various stories to test different scenarios:

- **Default**: Basic weather card with metric units
- **ImperialUnits**: Test with Fahrenheit and mph
- **HighWinds**: Test wind warning messages
- **NoData**: Test "no data" states
- **ErrorFromApi**: Test error message translations
- **AllLocales**: Special story to test all supported languages

### 4. RTL Support

When switching to Arabic (عربي), notice that:
- The document direction automatically changes to RTL
- Text alignment adjusts appropriately
- The layout remains functional and readable

### 5. Storybook Integration

The i18n integration follows the [Storybook react-i18next recipe](https://storybook.js.org/recipes/react-i18next):
- Uses the main app's i18n configuration
- Provides a locale switcher in the toolbar
- Automatically handles document direction changes
- Wraps stories with I18nextProvider

## Usage in Your App

The weather card component automatically uses the current locale from your app's i18n system. No additional configuration is needed - just ensure your app has the i18n system set up as shown in `src/lib/i18n.ts`.

## Translation Keys

All translations are stored in the main app's locale files:
- `src/locales/en/common.json`
- `src/locales/es/common.json`
- `src/locales/zh/common.json`
- `src/locales/ar/common.json`

The weather-specific translations are under the `weather.*` namespace.
