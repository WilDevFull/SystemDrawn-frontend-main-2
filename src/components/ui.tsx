import type { CSSProperties, ReactNode } from 'react';
import { getWebIcon } from './icons';

type CardProps = {
  children?: ReactNode;
  style?: CSSProperties;
};

type IconButtonProps = {
  icon: string;
  iconColor?: string;
  size?: number;
  style?: CSSProperties;
  onPress?: () => void;
  disabled?: boolean;
};

export function Card({ children, style }: CardProps) {
  return <div style={style}>{children}</div>;
}

export function IconButton({
  icon,
  iconColor = 'currentColor',
  size = 24,
  style,
  onPress,
  disabled = false,
}: IconButtonProps) {
  const Icon = getWebIcon(icon);
  const iconElement = <Icon aria-hidden="true" color={iconColor} size={size} style={style} />;

  if (!onPress) {
    return <span role="img" aria-label={icon}>{iconElement}</span>;
  }

  return (
    <button
      type="button"
      aria-label={icon}
      disabled={disabled}
      onClick={onPress}
      style={{ display: 'inline-grid', placeItems: 'center', padding: 0, border: 0, background: 'transparent', cursor: disabled ? 'default' : 'pointer' }}
    >
      {iconElement}
    </button>
  );
}