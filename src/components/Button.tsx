import classnames from 'classnames';

interface Props {
  label: string;
  role?: 'primary' | 'secondary';
  type?: 'button' | 'submit';
  link?: string;
}

export default function Button({
  label,
  role = 'primary',
  type = 'button',
  link,
}: Props) {
  const text = link ? <a href={link}>{label}</a> : label;
  const classes = classnames({
    'rounded-base bg-gradient-to-r px-4 py-2.5 text-center text-sm leading-5 hover:bg-gradient-to-br focus:ring-4 focus:outline-none cursor-pointer font-bold rounded-md': true,
    'text-dh-purple from-yellow-300 via-yellow-400 to-yellow-500 focus:ring-violet-900':
      role === 'primary',
    'text-dh-purple from-teal-300 via-teal-400 to-teal-500 focus:ring-teal-900':
      role === 'secondary',
  });

  return (
    <button type={type} className={classes}>
      {text}
    </button>
  );
}
