import type { Meta, StoryObj } from '@storybook/react';
import Weather3DayCard from './src/Weather3DayCard';
import type { WeatherForecast } from './src/Weather3DayCard';

const todayISO = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const baseSample: WeatherForecast = {
  source: 'open-meteo',
  fetchedAt: new Date().toISOString(),
  location: { lat: 51.5072, lon: -0.1276, timezone: 'Europe/London' },
  days: [
    {
      date: todayISO(0),
      tempMaxC: 6,
      tempMinC: -1,
      windMaxMS: 2.2,
      precipProb: 35,
      weatherCode: 2,
    }, // below cut-in + icing
    {
      date: todayISO(1),
      tempMaxC: 15,
      tempMinC: 9,
      windMaxMS: 11.4,
      precipProb: 20,
      weatherCode: 61,
    }, // optimal/near rated
    {
      date: todayISO(2),
      tempMaxC: 18,
      tempMinC: 12,
      windMaxMS: 26.0,
      precipProb: 10,
      weatherCode: 95,
    }, // cut-out risk
  ],
};

const meta: Meta<typeof Weather3DayCard> = {
  title: 'Weather/Weather3DayCard',
  component: Weather3DayCard,
  parameters: {
    docs: {
      description: {
        component: 'A weather forecast card component with internationalization support. Use the Locale switcher in the toolbar to test different languages.',
      },
    },
  },
  args: { 
    forecast: baseSample, 
    title: undefined, // Let the component use the default translated title
    units: 'metric' 
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Custom title for the weather card. If not provided, uses the default translated title.',
    },
    units: {
      control: { type: 'select' },
      options: ['metric', 'imperial'],
      description: 'Unit system for temperature and wind speed.',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to display the card in compact mode.',
    },
    showTimezone: {
      control: 'boolean',
      description: 'Whether to show the timezone information.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Weather3DayCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default weather card with metric units. The title will be automatically translated based on the selected locale.',
      },
    },
  },
};

export const ImperialUnits: Story = {
  args: {
    forecast: {
      ...baseSample,
      days: baseSample.days.map((d) => ({ ...d })),
    },
    units: 'imperial',
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card with imperial units (Fahrenheit, mph). All text will be translated based on the selected locale.',
      },
    },
  },
};

export const HighWinds: Story = {
  args: {
    forecast: {
      ...baseSample,
      days: [
        {
          date: todayISO(0),
          tempMaxC: 20,
          tempMinC: 12,
          windMaxMS: 19.5,
          precipProb: 5,
          weatherCode: 1,
        },
        {
          date: todayISO(1),
          tempMaxC: 21,
          tempMinC: 13,
          windMaxMS: 22.0,
          precipProb: 10,
          weatherCode: 2,
        },
        {
          date: todayISO(2),
          tempMaxC: 22,
          tempMinC: 14,
          windMaxMS: 27.5,
          precipProb: 15,
          weatherCode: 95,
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card showing high wind conditions with cut-out risk warnings. All labels and warnings are translated.',
      },
    },
  },
};

export const CustomTitle: Story = {
  args: {
    forecast: baseSample,
    title: 'Custom Forecast Title',
    units: 'metric',
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card with a custom title. Note that while the title is custom, all other text (labels, units, warnings) will still be translated.',
      },
    },
  },
};

export const NoData: Story = {
  args: {
    forecast: {
      source: 'test',
      fetchedAt: new Date().toISOString(),
      location: { lat: 0, lon: 0, timezone: 'UTC' },
      days: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card with no forecast data. The "No data" message will be translated based on the selected locale.',
      },
    },
  },
};

export const ErrorFromApi: Story = {
  args: {
    // Triggers internal fetch (no forecast supplied) and shows error message
    lat: 40.7128,
    lon: -74.006,
    apiUrl: '/api/does-not-exist',
    title: undefined, // Use default translated title
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card showing an API error state. Error messages will be translated based on the selected locale.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    forecast: baseSample,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version of the weather card. All text remains translated.',
      },
    },
  },
};

export const Spacious: Story = {
  args: {
    forecast: baseSample,
    compact: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Spacious version of the weather card with more padding. All text remains translated.',
      },
    },
  },
};

export const ShowTimezone: Story = {
  args: {
    forecast: baseSample,
    showTimezone: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card showing timezone information. All labels are translated.',
      },
    },
  },
};

export const FiveDays: Story = {
  args: {
    forecast: {
      ...baseSample,
      days: [
        ...baseSample.days,
        {
          date: todayISO(3),
          tempMaxC: 17,
          tempMinC: 11,
          windMaxMS: 8.2,
          precipProb: 25,
          weatherCode: 3,
        },
        {
          date: todayISO(4),
          tempMaxC: 19,
          tempMinC: 12,
          windMaxMS: 13.4,
          precipProb: 40,
          weatherCode: 61,
        },
      ],
    },
    days: 5,
    title: undefined, // Use default translated title
  },
  parameters: {
    docs: {
      description: {
        story: 'Extended 5-day weather forecast. All text and labels are translated.',
      },
    },
  },
};

export const MissingFields: Story = {
  args: {
    forecast: {
      source: 'test',
      fetchedAt: new Date().toISOString(),
      location: { lat: 51.5, lon: -0.12, timezone: 'Europe/London' },
      days: [
        {
          date: todayISO(0),
          tempMaxC: 10,
          tempMinC: 6,
          windMaxMS: undefined,
          windDirDeg: undefined,
          precipProb: undefined,
          weatherCode: undefined,
        },
        {
          date: todayISO(1),
          tempMaxC: 12,
          tempMinC: 7,
          windMaxMS: 5.5,
          windDirDeg: 90,
          precipProb: 0,
          weatherCode: 1,
        },
        {
          date: todayISO(2),
          tempMaxC: 14,
          tempMinC: 8,
          windMaxMS: 16.2,
          windDirDeg: 250,
          precipProb: 60,
          weatherCode: 95,
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Weather card with some missing data fields. Handles missing data gracefully with translated fallbacks.',
      },
    },
  },
};

// Special story to demonstrate all supported locales
export const AllLocales: Story = {
  args: {
    forecast: baseSample,
    title: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the weather card in all supported locales. Use the Locale switcher in the toolbar to switch between English, Spanish, Chinese, and Arabic. Notice how the text direction changes for Arabic (RTL).',
      },
    },
  },
};
