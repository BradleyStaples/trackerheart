import {Fragment, useState, type ChangeEvent} from 'react';
import classnames from 'classnames';
import Button from './Button';
import ResourceIcons from './ResourceIcons';

interface Props {
  value: number;
  maxValue: number;
  maxLimit: number;
  showMaxDropdown?: boolean;
  attribute: string;
  label: string;
  icon: string;
}

export default function ResourceIconsManager({
  value: initialValue,
  maxValue: initialMaxValue,
  maxLimit,
  showMaxDropdown,
  attribute,
  label,
  icon,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  const [hasUpdated, setHasUpdated] = useState(false);
  const array = new Array<string>(maxLimit).fill('');

  // handle lack of data coming from dynamic defaulting values to 0 initially
  if (!hasUpdated && (value !== initialValue || maxValue !== initialMaxValue)) {
    setValue(initialValue);
    setMaxValue(initialMaxValue);
    setHasUpdated(true);
  }

  const handleRadio = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
  };

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const newMaxValue = parseInt(event.target.value, 10);
    setMaxValue(newMaxValue);
    if (value > newMaxValue) {
      setValue(newMaxValue);
    }
  };

  const handleClear = () => {
    setValue(0);
  };

  return (
    <div className='mbe-4 flex'>
      <div className='grow'>
        <div className='flex items-center'>
          <div className='w-16'>
            <Button role='tertiary' label='Clear' onClick={handleClear} />
          </div>
          <div className='grow'>
            <ResourceIcons
              value={value}
              maxValue={maxValue}
              maxLimit={maxLimit}
              attribute={attribute}
              label={label}
              icon={icon}
              handleRadio={handleRadio}
            />
          </div>
        </div>
      </div>
      <div className='w-18 grow-0'>
        {showMaxDropdown && (
          <label className='flex h-full flex-col items-end justify-start'>
            <div className='text-right font-bold'>Max</div>
            <select
              name={`${attribute}MaxValue`}
              className='rounded-base inline-block w-16 border bg-white px-3 py-1 text-center text-sm text-gray-700 shadow-xs ring-yellow-300 focus:ring-4 focus:outline-none'
              value={maxValue}
              onChange={handleSelect}
            >
              {array.map((_, index) => {
                const value = index + 1;
                return (
                  <option key={`max-${attribute}-${value}`} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
