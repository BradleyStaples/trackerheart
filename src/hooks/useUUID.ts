import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

export const DEVICE_ID_COOKIE = 'deviceId';
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

function readDeviceIdCookie() {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${DEVICE_ID_COOKIE}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : undefined;
}

// returns undefined during SSR, on the client it is available on first render
export default function useUUID() {
  const [deviceId] = useState<string | undefined>(() =>
    typeof document === 'undefined'
      ? undefined
      : (readDeviceIdCookie() ?? uuidv4()),
  );

  useEffect(() => {
    if (deviceId && readDeviceIdCookie() !== deviceId) {
      document.cookie = `${DEVICE_ID_COOKIE}=${encodeURIComponent(deviceId)}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;
    }
  }, [deviceId]);

  return deviceId;
}
