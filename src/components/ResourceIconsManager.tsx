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
  const [previousProps, setPreviousProps] = useState({
    value: initialValue,
    maxValue: initialMaxValue,
  });
  // +1 to maxLimit to allow for a "0" option in the dropdown
  const array = new Array<string>(maxLimit + 1).fill('');

  // Reset to the new values when the props change (for example when data
  // arrives after the first render). Compare against the previous props, not
  // the current state, or the user's own edits would be treated as a change.
  if (
    previousProps.value !== initialValue ||
    previousProps.maxValue !== initialMaxValue
  ) {
    setPreviousProps({value: initialValue, maxValue: initialMaxValue});
    setValue(initialValue);
    setMaxValue(initialMaxValue);
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
        <div
          className={`flex ${showMaxDropdown ? 'items-start' : 'items-center'}`}
        >
          <div className='flex w-20 flex-col items-start justify-start'>
            {showMaxDropdown && (
              <label className='mbe-2 flex h-full flex-col items-start justify-start'>
                <div className='font-bold'>Max</div>
                <select
                  name={`${attribute}MaxValue`}
                  className='rounded-base ring-dh-gold inline-block w-16 border bg-white px-3 py-1 text-center text-sm text-gray-700 shadow-xs focus:ring-3 focus:outline-none'
                  value={maxValue}
                  onChange={handleSelect}
                >
                  {array.map((_, index) => {
                    return (
                      <option key={`max-${attribute}-${index}`} value={index}>
                        {index}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
            <Button
              variant='tertiary'
              size='small'
              label='Clear'
              onClick={handleClear}
            />
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
    </div>
  );
}
