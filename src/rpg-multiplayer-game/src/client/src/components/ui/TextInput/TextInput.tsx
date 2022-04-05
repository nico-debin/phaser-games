import React, { useState, SyntheticEvent } from 'react';

interface TextInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (str: string) => void;
}

const TextInput = ({
  value,
  placeholder,
  onChange = () => null,
}: TextInputProps) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="text-input"
    />
  );
};

export default TextInput;
