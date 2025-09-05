// src/components/theme/ThemeToggle.tsx
import { FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, Box, Chip } from '@mui/material';
import { useColorMode } from './ColorModeProvider';
import PaletteIcon from '@mui/icons-material/Palette';

export default function ThemeToggle() {
  const { mode, set } = useColorMode();
  
  return (
    <FormControl component="fieldset" size="small">
      
      <RadioGroup
        row
        aria-label="Theme selection"
        value={mode}
        onChange={(e) => set((e.target as HTMLInputElement).value as 'light' | 'dark' | 'custom')}
        name="theme-options"
      >
        <FormControlLabel 
          value="light" 
          control={<Radio size="small" />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Light
            </Box>
          } 
        />
        <FormControlLabel 
          value="dark" 
          control={<Radio size="small" />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Dark
            </Box>
          } 
        />
        <FormControlLabel 
          value="custom" 
          control={<Radio size="small" />} 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Energy
              <Chip 
                label="Pro" 
                size="small" 
                color="success" 
                sx={{ 
                  height: 16, 
                  fontSize: '0.65rem',
                  '& .MuiChip-label': { px: 0.5 }
                }} 
              />
            </Box>
          } 
        />
      </RadioGroup>
    </FormControl>
  );
}
