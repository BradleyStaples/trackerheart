import classnames from 'classnames';
import type {ComponentPropsWithoutRef} from 'react';

export type ButtonVariant =
  'primary' | 'secondary' | 'tertiary' | 'destructive';
export type ButtonSize = 'small' | 'medium' | 'large' | 'full';

interface Props extends ComponentPropsWithoutRef<'button'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  link?: string;
}

export default function Button({
  label,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  link,
  className = '',
  ...rest
}: Props) {
  const ringClasses = classnames({
    'rounded-md focus:outline-none focus:ring-3 focus:ring-dh-gold': !!link,
  });
  const classes = classnames({
    'inline-block bg-gradient-to-r text-center text-sm leading-5 hover:bg-gradient-to-br focus:outline-none cursor-pointer font-bold rounded-md focus:ring-3 focus:ring-dh-gold active:ring-3 active:ring-dh-gold': true,
    'px-2 py-1': size === 'small',
    'px-2 py-2.5': size === 'medium',
    'px-4 py-2.5': size === 'large',
    'w-full py-2.5': size === 'full',
    'text-dh-purple from-yellow-300 via-yellow-400 to-yellow-500 hover:text-violet-900 active:text-violet-900 border border-purple-800 hover:border-purple-900 active:border-purple-900':
      variant === 'primary',
    'text-dh-purple from-teal-300 via-teal-400 to-teal-500 hover:text-teal-900 active:text-teal-900 border border-purple-800 hover:border-purple-900 active:border-purple-900':
      variant === 'secondary',
    'text-dh-gray from-purple-600 via-purple-700 to-purple-800 border border-purple-600 hover:text-white active:text-white hover:border-purple-900 active:border-purple-900':
      variant === 'tertiary',
    'text-dh-gray from-red-500 via-red-600 to-red-700 border border-red-800 hover:text-white active:text-white hover:border-red-900 active:border-red-900':
      variant === 'destructive',
    [className]: !!className,
  });

  return (
    <button {...rest} type={type} className={link ? ringClasses : classes}>
      {link ? (
        <a href={link} className={classes}>
          {label}
        </a>
      ) : (
        label
      )}
    </button>
  );
}
