import classnames from 'classnames';

interface Props {
  label: string;
  role?: 'primary' | 'secondary' | 'tertiary';
  type?: 'button' | 'submit';
  link?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
  role = 'primary',
  type = 'button',
  link,
  onClick,
  className = '',
}: Props) {
  const classes = classnames({
    [className]: !!className,
    'rounded-base bg-gradient-to-r text-center text-sm leading-5 hover:bg-gradient-to-br focus:outline-none cursor-pointer font-bold rounded-md': true,
    'px-4 py-2.5 focus:ring-4 text-dh-purple from-yellow-300 via-yellow-400 to-yellow-500 focus:ring-violet-900 active:ring-violet-900':
      role === 'primary',
    'px-4 py-2.5 focus:ring-4 text-dh-purple from-teal-300 via-teal-400 to-teal-500 focus:ring-teal-900 active:ring-teal-900':
      role === 'secondary',
    'px-2 py-1 mbe-1 focus:ring-3 text-white border border-white focus:ring-blue-500 active:ring-blue-500':
      role === 'tertiary',
  });

  return link ? (
    <a href={link} className={classes}>
      {label}
    </a>
  ) : (
    <button type={type} className={classes} onClick={onClick}>
      {label}
    </button>
  );
}
