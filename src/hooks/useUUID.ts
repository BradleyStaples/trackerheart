'use client';

import {v4 as uuidv4} from 'uuid';
import useLocalStorage from './useLocalStorage';

export default function useUUID() {
  const uuid = uuidv4();
  const [deviceId, setDeviceId] = useLocalStorage<string>('deviceId', '');
  if (deviceId === '') {
    setDeviceId(uuid);
  }
  return deviceId || uuid;
}
