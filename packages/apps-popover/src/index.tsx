import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AnchorPopover from '@your-scope/anchor-popover';

export type AppCard = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  iconSrc?: string;
};

export type AppsPopoverProps = {
  trigger: React.ReactNode;
  items?: AppCard[];
  width?: number;
};

const fallbackItems: AppCard[] = [
  { id: 'example-1', title: 'Example 1', subtitle: 'Demo', href: 'http://localhost:6006', iconSrc: '/window.svg' },
  { id: 'example-2', title: 'Example 2', subtitle: 'Demo', href: 'http://localhost:6006', iconSrc: '/globe.svg' },
  { id: 'example-3', title: 'Example 3', subtitle: 'Demo', href: 'http://localhost:6006', iconSrc: '/file.svg' },
  { id: 'example-4', title: 'Example 4', subtitle: 'Demo', href: 'http://localhost:6006', iconSrc: '/next.svg' },
];

export default function AppsPopover({ trigger, items, width = 440 }: AppsPopoverProps) {
  const list = items && items.length ? items : fallbackItems;
  return (
    <AnchorPopover
      id="apps-popover"
      trigger={<Box>{trigger}</Box>}
      paperSx={{ p: 2, width, maxHeight: 520, borderRadius: 0.0, mt: 2 }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.25 }}>
          {list.map((app) => (
            <Box key={app.id}>
              <Card variant="outlined" sx={{ p: 1, height: 72 }}>
                <CardContent sx={{ p: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 28, height: 28, overflow: 'hidden', flexShrink: 0, bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {app.iconSrc ? (<img src={app.iconSrc} alt="" width={20} height={20} />) : null}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.subtitle}
                      </Typography>
                      <Link href={app.href} target="_blank" rel="noopener" variant="caption">
                        Open
                      </Link>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </AnchorPopover>
  );
}


