import {
    ArrowLeft,
    Bell,
    BellOff,
    BellRing,
    Calendar,
    CalendarCheck,
    CalendarClock,
    CheckCircle,
    ChevronRight,
    CircleAlert,
    CircleHelp,
    Clock3,
    Diamond,
    Gem,
    Languages,
    LogOut,
    Palette,
    RefreshCw,
    Settings,
    ShieldCheck,
    TextCursorInput,
    Trash2,
    UserRound,
    type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';

const icons: Record<string, LucideIcon> = {
  'account-outline': UserRound,
  'alert-circle-outline': CircleAlert,
  'arrow-back': ArrowLeft,
  'arrow-left': ArrowLeft,
  bell: Bell,
  'bell-off-outline': BellOff,
  'bell-outline': Bell,
  'bell-ring-outline': BellRing,
  calendar: Calendar,
  'calendar-check-outline': CalendarCheck,
  'calendar-clock': CalendarClock,
  'check-circle': CheckCircle,
  'chevron-right': ChevronRight,
  'cog-outline': Settings,
  'delete-outline': Trash2,
  'diamond-outline': Diamond,
  'diamond-stone': Gem,
  'format-font-size-increase': TextCursorInput,
  history: Clock3,
  logout: LogOut,
  palette: Palette,
  'palette-outline': Palette,
  'shield-check-outline': ShieldCheck,
  sync: RefreshCw,
  translate: Languages,
  'trash-can-outline': Trash2,
};

export function getWebIcon(name: string) {
  return icons[name] ?? CircleHelp;
}

type WebIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
  testID?: string;
};

function WebIcon({ name, size = 24, color = 'currentColor', style, testID }: WebIconProps) {
  const Icon = getWebIcon(name);

  return (
    <Icon
      aria-hidden="true"
      data-testid={testID}
      size={size}
      color={color}
      style={style}
    />
  );
}

export const MaterialCommunityIcons = WebIcon;
export const Ionicons = WebIcon;