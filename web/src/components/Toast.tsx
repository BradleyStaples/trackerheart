import {useEffect, useRef, useState} from 'react';
import classnames from 'classnames';
import {Toast, ToastToggle} from 'flowbite-react';

type Tone = 'info' | 'success' | 'error';

const DISPLAY_DURATION = 3000;

interface Props {
  message: string;
  anchorName: string;
  show: boolean;
  onHide?: () => void;
  tone?: Tone;
}

export default function ToastComponent({
  message,
  anchorName,
  show,
  onHide,
  tone = 'info',
}: Props) {
  const [previousShow, setPreviousShow] = useState(show);
  const [expired, setExpired] = useState(false);
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  // Each time `show` flips, start over: a new true shows the Toast again.
  if (show !== previousShow) {
    setPreviousShow(show);
    setExpired(false);
  }

  const hide = () => {
    setExpired(true);
    onHideRef.current?.();
  };

  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(() => {
      setExpired(true);
      onHideRef.current?.();
    }, DISPLAY_DURATION);
    return () => clearTimeout(timeout);
  }, [show]);

  if (!show || expired) return null;

  const toastClasses = classnames({
    'fixed z-50 min-w-48': true,
    'bg-blue-200': tone === 'success',
    'bg-red-200': tone === 'error',
  });

  const textClasses = classnames({
    'pl-3 w-full text-center text-sm font-bold': true,
    'text-blue-700': tone === 'success',
    'text-red-700': tone === 'error',
  });

  return (
    <span className='relative'>
      <Toast
        className={toastClasses}
        style={{
          positionAnchor: anchorName,
          insetBlockStart: 'anchor(center)',
          insetInlineStart: 'anchor(center)',
          translate: '-50% -50%',
        }}
      >
        <div className={textClasses}>{message}</div>
        <ToastToggle onDismiss={hide} />
      </Toast>
    </span>
  );
}
