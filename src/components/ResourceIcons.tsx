import {Fragment, useState, type ChangeEvent} from 'react';
import classnames from 'classnames';
import Button from './Button';

interface Props {
  value: number;
  maxValue: number;
  maxLimit: number;
  showMaxDropdown?: boolean;
  attribute: string;
  label: string;
  icon: string;
}

export default function ResourceIcons({
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
  const radioClasses =
    'absolute h-6 w-6 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-dh-blue focus rounded-md';

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
            <div className='font-bold'>{label}:</div>
            {array.map((_, index) => {
              const radioNumber = index + 1;
              const isFilled = radioNumber <= value;
              const isDisabled = radioNumber > maxValue;

              return (
                <Fragment key={`radio-${attribute}-${radioNumber}`}>
                  {radioNumber === 7 && (
                    <div key={`${attribute}-resource-divider`} />
                  )}
                  <label
                    className='relative z-10 me-2 inline-block h-6 w-6'
                    key={attribute + radioNumber}
                  >
                    <input
                      className={radioClasses}
                      type='radio'
                      name={attribute}
                      checked={radioNumber === value}
                      disabled={isDisabled}
                      onChange={handleRadio}
                      value={radioNumber}
                    />
                    <span
                      className={classnames({
                        [`icon-${icon}`]: true,
                        'z-0 block h-6 w-6 ring-yellow-300 focus:ring-1 focus:outline-none': true,
                        'checkbox-icon-filled': isFilled,
                        'cursor-pointer': !isDisabled,
                        'checkbox-icon-disabled': isDisabled,
                      })}
                    ></span>
                  </label>
                </Fragment>
              );
            })}
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
