import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  Skeleton,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  useTheme,
  Collapse,
  Divider,
  ButtonBase,
} from '@mui/material';
import { alpha, darken, type Theme } from '@mui/material/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useTranslation } from 'react-i18next';

export type WorkOrderStatus = 'open' | 'in_progress' | 'closed' | string;
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical' | string;

export interface WorkOrder {
  id: string;
  windTurbineId: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  assignedTo?: string;
  createdDate: string; // ISO
  dueDate?: string; // ISO
  resolvedDate?: string; // ISO
}

export interface WorkOrderComment {
  id: string;
  workOrderId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderCardProps {
  workOrder: WorkOrder;
  comments?: WorkOrderComment[];
  commentsLoading?: boolean;
  expanded?: boolean;
  onToggleExpand?: (workOrderId: string) => void;
  onLoadComments?: (workOrderId: string) => void;
  t?: (key: string) => string;
}

/**
 * Individual work order card component with:
 * - Clear visual hierarchy and status indicators
 * - Priority and status color coding
 * - Expandable comments section
 * - Progress timeline visualization
 * - Responsive design with hover effects
 */
export default function WorkOrderCard({
  workOrder,
  comments = [],
  commentsLoading = false,
  expanded = false,
  onToggleExpand,
  onLoadComments,
  t: tProp,
}: WorkOrderCardProps) {
  const { t: tHook } = useTranslation('common');
  const t = tProp || tHook;
  const theme = useTheme();

  // Derived presentation-only values (UI)
  const created =
    (workOrder as any).createdDate ||
    (workOrder as any).createdAt ||
    (workOrder as any).created ||
    (workOrder as any).created_on;
  const createdMs = toMs(created);
  const dueMs = toMs((workOrder as any).dueDate);
  const resolvedMs = toMs((workOrder as any).resolvedDate);
  const now = Date.now();

  const statusKey = String(workOrder.status || '').toLowerCase();
  const priorityKey = String(workOrder.priority || '').toLowerCase();

  const statusCfg = getStatusCfg(statusKey, theme);
  const prioCfg = getPriorityCfg(priorityKey, theme);

  // Accent color for the card: priority first, else status
  const accent = prioCfg.colorMain ?? statusCfg.colorMain;

  const isOverdue =
    dueMs != null && now > dueMs && statusKey !== 'closed' && statusKey !== 'resolved';
  const dueText = formatDue(dueMs, now, statusKey, t);

  const createdText = formatDateShort(createdMs);
  const resolvedText = formatDateShort(resolvedMs);

  const progressPct = getProgressPercent(createdMs, dueMs, now);

  const assignee = (workOrder.assignedTo as string | undefined)?.trim();
  const initials = assignee ? getInitials(assignee) : null;

  // Comments
  const commentCount = Array.isArray(comments) ? comments.length : 0;
  const hasComments = commentCount > 0;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasComments) return;
    onToggleExpand?.(workOrder.id);
  };

  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 0.5,
        position: 'relative',
        overflow: 'hidden',
        transition: t.transitions.create(['box-shadow', 'transform'], {
          duration: t.transitions.duration.shorter,
        }),
        boxShadow: 'none',
        '&:hover': {
          boxShadow: `0 6px 24px ${alpha(t.palette.common.black, 0.22)}`,
          transform: 'translateY(-1px)',
        },
        // Left accent rail
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          bgcolor: accent,
        },
        // Subtle gradient wash
        backgroundImage: `linear-gradient(90deg, ${alpha(accent, 0.07)} 0%, transparent 42%)`,
        borderColor: alpha(accent, 0.22),
      })}
    >
      <CardContent sx={{ py: 1.25, px: 1.5 }}>
        <Stack spacing={1}>
          {/* Header: title (prominent) on the left, compact status/priority on the right */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 0 }}
          >
            <Tooltip title={workOrder.title}>
              <Typography
                sx={{
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {workOrder.title}
              </Typography>
            </Tooltip>
          </Stack>

          {/* Meta row: compact icons, right-aligned for scannability */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ color: 'text.secondary', flexWrap: 'wrap' }}
          >
            <Meta icon={<CalendarMonthRoundedIcon fontSize="small" />} text={createdText ?? '—'} />
            {dueText ? (
              <Meta
                icon={
                  isOverdue ? (
                    <EventBusyRoundedIcon fontSize="small" color="error" />
                  ) : (
                    <ScheduleRoundedIcon fontSize="small" />
                  )
                }
                text={dueText}
                sx={{
                  color: isOverdue ? 'error.main' : 'text.secondary',
                  fontWeight: isOverdue ? 700 : undefined,
                }}
              />
            ) : null}
            {assignee ? (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Avatar
                  sx={{
                    width: 18,
                    height: 18,
                    fontSize: 10,
                    bgcolor: alpha(accent, 0.25),
                    color: darken(accent, 0.1),
                  }}
                >
                  {initials}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  {assignee}
                </Typography>
              </Stack>
            ) : (
              <Meta icon={<PersonOutlineRoundedIcon fontSize="small" />} text={t('workOrders.unassigned')} />
            )}
            {resolvedText ? (
              <Meta icon={<CheckCircleRoundedIcon fontSize="small" />} text={`${t('workOrders.resolved')} ${resolvedText}`} />
            ) : null}
          </Stack>

          {/* Description */}
          {workOrder.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {workOrder.description}
            </Typography>
          ) : null}

          {/* Timeline / progress to due date (presentational) */}
          {typeof progressPct === 'number' && Number.isFinite(progressPct) ? (
            <Box sx={{ mt: 0.25 }}>
              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  bgcolor: alpha(accent, 0.16),
                  '& .MuiLinearProgress-bar': { backgroundColor: accent },
                }}
                aria-label={t('workOrders.timeProgress')}
              />
            </Box>
          ) : null}

          {/* Bottom row: comments toggle (left) for strong affordance */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pt: 0.5 }}
          >
            <ButtonBase
              onClick={handleToggleExpand}
              disabled={!hasComments}
              sx={(t) => ({
                borderRadius: 999,
                px: 1,
                py: 0.25,
                gap: 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                opacity: hasComments ? 1 : 0.5,
                color: hasComments ? (t.vars ?? t).palette.primary.main : 'text.disabled',
                transition: t.transitions.create(['background-color', 'transform'], {
                  duration: t.transitions.duration.shorter,
                }),
                '&:hover': {
                  backgroundColor: alpha((t.vars ?? t).palette.primary.main, 0.08),
                },
              })}
              aria-label={expanded ? t('workOrders.collapseComments') : t('workOrders.expandComments')}
            >
              <ExpandMoreRoundedIcon
                fontSize="small"
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: (t) =>
                    t.transitions.create('transform', {
                      duration: t.transitions.duration.shorter,
                    }),
                }}
              />
              <ChatBubbleOutlineRoundedIcon fontSize="small" />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {hasComments ? `${t('workOrders.comments')} (${commentCount})` : t('workOrders.noComments')}
              </Typography>
            </ButtonBase>

            {/* (Optional) subtle status echo on the far right for balance */}
            <Stack direction="row" spacing={0.75} alignItems="center">
              <TinyEcho color={statusCfg.colorMain} />
              <Typography variant="caption" color="text.secondary">
                {workOrder.status}
              </Typography>
            </Stack>
          </Stack>

          {/* Expanded comments section */}
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            sx={(t) => ({
              mt: 0.75,
              borderRadius: 1,
              backgroundColor: alpha(
                (t.vars ?? t).palette.primary.main,
                t.palette.mode === 'dark' ? 0.06 : 0.04
              ),
              border: '1px solid',
              borderColor: 'divider',
            })}
          >
            <Box sx={{ p: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                <ChatBubbleOutlineRoundedIcon fontSize="small" color="primary" />
                <Typography variant="overline" sx={{ letterSpacing: 0.6 }}>
                  {t('workOrders.comments')} {hasComments ? `(${commentCount})` : ''}
                </Typography>
              </Stack>
              <Stack divider={<Divider flexItem />} spacing={1}>
                {commentsLoading ? (
                  <>
                    <Skeleton variant="text" width={220} height={18} />
                    <Skeleton variant="text" width={260} height={18} />
                  </>
                ) : Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((c) => <CommentItem key={c.id} comment={c} accent={accent} />)
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
                    {t('workOrders.noCommentsAvailable')}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ---------- Small presentational helpers (UI only) ---------- */

function TinyEcho({ color }: { color: string }) {
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: color,
        boxShadow: (t) => `0 0 0 2px ${alpha((t.vars ?? t).palette.background.paper, 1)}`,
      }}
    />
  );
}

function CommentItem({
  comment,
  accent,
}: {
  comment: { id: string; userId: string; content: string; createdAt: string };
  accent: string;
}) {
  const when = formatDateTime(comment.createdAt);
  const initials = getInitials(comment.userId || 'U');
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <Avatar
        sx={{
          width: 24,
          height: 24,
          fontSize: 12,
          bgcolor: alpha(accent, 0.25),
          color: alpha(accent, 0.9),
          mt: 0.25,
          flex: '0 0 auto',
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          {comment.userId} • {when}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {comment.content}
        </Typography>
      </Box>
    </Stack>
  );
}

function Meta({
  icon,
  text,
  sx,
}: {
  icon?: React.ReactNode;
  text: React.ReactNode;
  sx?: Record<string, any>;
}) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={sx}>
      {icon ? <Box sx={{ color: 'text.secondary' }}>{icon}</Box> : null}
      <Typography variant="caption" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}

function toMs(v: unknown): number | null {
  if (!v || typeof v !== 'string') return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : t;
}

function formatDateShort(ms: number | null): string | undefined {
  if (ms == null) return undefined;
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(ms));
  } catch {
    return undefined;
  }
}

function formatDateTime(iso: string | number | null | undefined): string {
  if (!iso) return '';
  const ms = typeof iso === 'number' ? iso : typeof iso === 'string' ? Date.parse(iso) : NaN;
  if (Number.isNaN(ms)) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(ms));
}

function formatDue(dueMs: number | null, now: number, statusKey: string, t: any): string | undefined {
  if (dueMs == null) return undefined;
  const diff = dueMs - now;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((abs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  if (diff >= 0) {
    if (statusKey === 'closed' || statusKey === 'resolved') return t('workOrders.closed');
    return days > 0 ? `${t('workOrders.dueIn')} ${days}d ${hours}h` : `${t('workOrders.dueIn')} ${hours}h`;
  }
  return days > 0 ? `${t('workOrders.overdueBy')} ${days}d` : `${t('workOrders.overdueBy')} ${hours}h`;
}

function getProgressPercent(createdMs: number | null, dueMs: number | null, now: number): number | null {
  if (createdMs == null || dueMs == null || dueMs <= createdMs) return null;
  const pct = ((now - createdMs) / (dueMs - createdMs)) * 100;
  return Math.max(0, Math.min(100, pct));
}

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const a = parts[0]?.[0] ?? '';
  const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (a + b).toUpperCase();
}

function getStatusCfg(
  key: string,
  theme: Theme
): { chipColor: 'default' | 'success' | 'info' | 'warning' | 'error'; icon: React.ReactNode; colorMain: string } {
  switch (key) {
    case 'open':
      return { chipColor: 'info', icon: <PlayArrowRoundedIcon fontSize="small" />, colorMain: theme.palette.info.main };
    case 'in_progress':
    case 'in-progress':
    case 'progress':
      return {
        chipColor: 'warning',
        icon: (
          <AutorenewRoundedIcon
            fontSize="small"
            sx={{
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              animation: 'spin 6s linear infinite',
            }}
          />
        ),
        colorMain: theme.palette.warning.main,
      };
    case 'blocked':
      return { chipColor: 'error', icon: <BlockRoundedIcon fontSize="small" />, colorMain: theme.palette.error.main };
    case 'closed':
    case 'resolved':
      return { chipColor: 'success', icon: <CheckCircleRoundedIcon fontSize="small" />, colorMain: theme.palette.success.main };
    default:
      return { chipColor: 'default', icon: <TimelineRoundedIcon fontSize="small" />, colorMain: theme.palette.divider };
  }
}

function getPriorityCfg(
  key: string,
  theme: Theme
): { chipColor: 'default' | 'success' | 'info' | 'warning' | 'error'; colorMain: string | null } {
  switch (key) {
    case 'critical':
      return { chipColor: 'error', colorMain: theme.palette.error.main };
    case 'high':
      return { chipColor: 'warning', colorMain: theme.palette.warning.main };
    case 'medium':
      return { chipColor: 'info', colorMain: theme.palette.info.main };
    case 'low':
      return { chipColor: 'default', colorMain: alpha(theme.palette.text.primary, 0.3) };
    default:
      return { chipColor: 'default', colorMain: null };
  }
}
