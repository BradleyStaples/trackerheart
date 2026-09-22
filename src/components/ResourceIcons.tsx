import {Fragment, useState, type ChangeEvent} from 'react';
import classnames from 'classnames';
import Button from './Button';

interface Props {
  value: number;
  maxValue: number;
  maxLimit: number;
  attribute: string;
  label: string;
  icon: string;
  handleRadio?: (event: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export default function ResourceIconsManager({
  value,
  maxValue,
  maxLimit,
  attribute,
  label,
  icon,
  handleRadio,
  readOnly = false,
}: Props) {
  const array = new Array<string>(maxLimit).fill('');

  return (
    <div>
      <div className='font-bold'>{label}:</div>
      {array.map((_, index) => {
        const radioNumber = index + 1;
        const isFilled = radioNumber <= value;
        const isDisabled = radioNumber > maxValue;

        const radioClasses = classnames({
          'absolute h-6 w-6 appearance-none focus:outline-none focus:ring-3 focus:ring-dh-gold focus rounded-md': true,
          'cursor-pointer': !readOnly && !isDisabled,
        });

        return (
          <Fragment key={`radio-${attribute}-${radioNumber}`}>
            {radioNumber === 7 && <div key={`${attribute}-resource-divider`} />}
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
                readOnly={readOnly}
              />
              <span
                className={classnames({
                  [`icon-${icon}`]: true,
                  'ring-dh-gold z-0 block h-6 w-6 focus:ring-3 focus:outline-none': true,
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
  );
}
