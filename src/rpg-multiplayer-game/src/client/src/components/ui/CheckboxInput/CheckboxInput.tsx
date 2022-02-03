import React, { useState } from 'react'

import './CheckboxInput.scss'

interface CheckboxInputProps {
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const CheckboxInput = ({ label, value, onChange }: CheckboxInputProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(value);

  const clickHandler = () => {
    onChange(!isChecked);
    setIsChecked(!isChecked);
  }

  return (
    <div className="checkbox-input" >
      <div onClick={clickHandler} className={`custom-checkbox ${isChecked === true ? 'checked' : 'unchecked'}`}></div>
      <label onClick={clickHandler}>
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
