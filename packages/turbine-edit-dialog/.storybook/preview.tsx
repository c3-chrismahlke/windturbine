import type { Preview } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

// Create a default MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Initialize i18n for Storybook
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      common: {
        turbineEdit: {
          title: 'Edit Turbine',
          recordId: 'Record ID',
          fieldsNeedAttention: 'field needs attention',
          fieldsNeedAttentionPlural: 'fields need attention',
          identity: {
            title: 'Identity',
            name: 'Turbine Name',
            nameHelper: 'Enter a descriptive name for this turbine',
            manufacturer: 'Manufacturer',
            manufacturerHelper: 'Enter the manufacturer name',
            manufacturerCountry: 'Manufacturer Country',
            manufacturerCountryHelper: 'Enter the country where the manufacturer is based',
          },
          location: {
            title: 'Location',
            latitude: 'Latitude',
            latitudeHelper: 'Enter latitude between -90 and 90 degrees',
            longitude: 'Longitude',
            longitudeHelper: 'Enter longitude between -180 and 180 degrees',
          },
          specifications: {
            title: 'Specifications',
            capacity: 'Rated Capacity (kW)',
            capacityHelper: 'Enter the rated power capacity in kilowatts',
            active: 'Active',
          },
          lifecycle: {
            title: 'Lifecycle',
            builtDate: 'Built Date',
            installationDate: 'Installation Date',
            optional: 'Optional',
          },
          dangerZone: {
            title: 'Danger Zone',
            description: 'This action cannot be undone',
            deleteButton: 'Delete Turbine',
          },
          actions: {
            cancel: 'Cancel',
            save: 'Save',
          },
          validation: {
            nameRequired: 'Turbine name is required',
            latitudeRequired: 'Latitude is required',
            latitudeRange: 'Latitude must be between -90 and 90 degrees',
            longitudeRequired: 'Longitude is required',
            longitudeRange: 'Longitude must be between -180 and 180 degrees',
            capacityRequired: 'Rated capacity is required',
            capacityPositive: 'Rated capacity must be positive',
            manufacturerRequired: 'Manufacturer is required',
            builtDateInvalid: 'Invalid built date',
            installationDateInvalid: 'Invalid installation date',
            installationBeforeBuilt: 'Installation date cannot be before built date',
          },
          notifications: {
            saveSuccess: 'Turbine saved successfully',
            deleteSuccess: 'Turbine deleted successfully',
          },
          errors: {
            failedToSave: 'Failed to save turbine',
            failedToDelete: 'Failed to delete turbine',
          },
        },
      },
    },
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;
