import { IInput } from './Input';
import React, { useState } from 'react';
import './Inputs.css';
import { InputStyle } from '../helpers/compInterface';

const CCV: React.FC<IInput> = ({
  style = InputStyle.BUBBLE,
  size,
  value = '',
  placeholder = '123',
  onChange,
  children,
}) => {
  const classNames = `${style}-input ${size}`;
  const [ccv, setCcv] = useState<string>(value as string);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); 
    setCcv(input);
    if (onChange) {
      onChange(e); 
    }
  };

  return (
    <input
      className={classNames}
      value={ccv}
      onChange={handleChange}
      type="tel"
      maxLength={3}
      inputMode="numeric"
      placeholder={placeholder}
      required
      aria-label="Card Verification Value"
    >
      {children}
    </input>
  );
};

export default CCV;