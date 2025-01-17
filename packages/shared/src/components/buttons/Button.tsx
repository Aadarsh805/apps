import React, {
  HTMLAttributes,
  ReactNode,
  ReactElement,
  Ref,
  forwardRef,
} from 'react';
import classNames from 'classnames';
import { Size, IconProps } from '../Icon';
import { Loader } from '../Loader';
import { combinedClicks } from '../../lib/click';

export type ButtonSize =
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge';

const IconSize: Record<ButtonSize, Size> = {
  xxsmall: 'xsmall',
  xsmall: 'small',
  small: 'medium',
  medium: 'large',
  large: 'xlarge',
  xlarge: 'xxlarge',
};

export interface StyledButtonProps {
  buttonSize?: ButtonSize;
  iconOnly?: boolean;
}

export type IconType = React.ReactElement<IconProps>;

export interface BaseButtonProps {
  buttonSize?: ButtonSize;
  loading?: boolean;
  pressed?: boolean;
  tag?: React.ElementType;
  icon?: IconType;
  rightIcon?: IconType;
  children?: ReactNode;
  displayClass?: string;
  textPosition?: string;
  position?: string;
}

const useGetIconWithSize = (size: ButtonSize, iconOnly: boolean) => {
  return (icon: React.ReactElement<IconProps>) =>
    React.cloneElement(icon, {
      size: IconSize[size],
      className: classNames(icon.props.className, !iconOnly && 'icon'),
    });
};

export type AllowedTags = keyof Pick<JSX.IntrinsicElements, 'a' | 'button'>;
export type AllowedElements = HTMLButtonElement | HTMLAnchorElement;
export type ButtonElementType<Tag extends AllowedTags> = Tag extends 'a'
  ? HTMLAnchorElement
  : HTMLButtonElement;

export type ButtonProps<Tag extends AllowedTags> = BaseButtonProps &
  HTMLAttributes<AllowedElements> &
  JSX.IntrinsicElements[Tag] & {
    ref?: Ref<ButtonElementType<Tag>>;
    readOnly?: boolean;
  };

function ButtonComponent<TagName extends AllowedTags>(
  {
    loading,
    pressed,
    icon,
    rightIcon,
    buttonSize = 'medium',
    children,
    tag: Tag = 'button',
    className,
    displayClass,
    position = 'relative',
    textPosition = 'justify-center',
    readOnly,
    iconOnly: showIconOnly,
    onClick,
    ...props
  }: StyledButtonProps & ButtonProps<TagName>,
  ref?: Ref<ButtonElementType<TagName>>,
): ReactElement {
  const iconOnly = (icon && !children && !rightIcon) || showIconOnly;
  const getIconWithSize = useGetIconWithSize(buttonSize, iconOnly);
  const isAnchor = Tag === 'a';

  return (
    <Tag
      {...(props as StyledButtonProps)}
      {...(isAnchor ? combinedClicks(onClick) : { onClick })}
      aria-busy={loading}
      aria-pressed={pressed}
      ref={ref}
      className={classNames(
        { iconOnly, readOnly },
        buttonSize,
        'btn flex-row items-center border typo-callout font-bold no-underline shadow-none cursor-pointer select-none focus-outline',
        textPosition,
        displayClass || 'flex',
        position,
        className,
      )}
    >
      {icon && getIconWithSize(icon)}
      {children && <span>{children}</span>}
      {rightIcon && getIconWithSize(rightIcon)}
      {loading && (
        <Loader
          data-testid="buttonLoader"
          className="hidden absolute top-0 right-0 bottom-0 left-0 m-auto btn-loader"
        />
      )}
    </Tag>
  );
}

export const Button = forwardRef(ButtonComponent);
