import React, { useState } from 'react'

import './CheckboxInput.scss'

interface CheckboxInputProps {
  label: string;
  className?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const CheckboxInput = ({ label, value, className='', onChange = () => null }: CheckboxInputProps) => {

  const clickHandler = () => {
    onChange(!value);
  }

  return (
    <div className={`checkbox-input ${className}`} >
      <div onClick={clickHandler} className={`custom-checkbox ${value === true ? 'checked' : 'unchecked'}`}></div>
      <label onClick={clickHandler}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
