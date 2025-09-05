import * as React from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import type { PopoverProps } from '@mui/material/Popover';
import type { SxProps, Theme } from '@mui/material/styles';

export type AnchorPopoverProps = {
  id?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  paperSx?: SxProps<Theme>;
  anchorOrigin?: PopoverProps['anchorOrigin'];
  transformOrigin?: PopoverProps['transformOrigin'];
};

export default function AnchorPopover({
  id,
  trigger,
  children,
  paperSx,
  anchorOrigin,
  transformOrigin,
}: AnchorPopoverProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const popId = open ? id ?? 'anchor-popover' : undefined;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Box
        aria-describedby={popId}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setAnchorEl(e.currentTarget as HTMLElement);
          }
        }}
      >
        {trigger}
      </Box>
      <Popover
        id={popId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin ?? { vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={transformOrigin ?? { vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: paperSx } }}
      >
        {children}
      </Popover>
    </>
  );
}


