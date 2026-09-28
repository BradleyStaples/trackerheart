import {useEffect, useRef, useState} from 'react';
import {Toast, ToastToggle} from 'flowbite-react';

const DISPLAY_DURATION = 5000;

interface Props {
  message: string;
  anchorName: string;
  show: boolean;
  onHide?: () => void;
}

export default function ToastComponent({
  message,
  anchorName,
  show,
  onHide,
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

  return (
    <span className='relative'>
      <Toast
        className='fixed z-50 min-w-48'
        style={{
          positionAnchor: anchorName,
          insetBlockStart: 'anchor(center)',
          insetInlineStart: 'anchor(center)',
          translate: '-50% -50%',
        }}
      >
        <div className='ml-3 w-full text-center text-sm font-normal'>
          {message}
        </div>
        <ToastToggle onDismiss={hide} />
      </Toast>
    </span>
  );
}
