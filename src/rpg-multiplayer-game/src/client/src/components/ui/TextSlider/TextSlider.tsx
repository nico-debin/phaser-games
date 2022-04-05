import React, { useState, useEffect } from 'react';
import ArrowButton from '../ArrowButton';

import './TextSlider.scss';

interface TextSliderProps {
  placeholder: string;
  options: string[];
  startKey: number;
  setStartKey: (key: number) => void;
  onSlide?: (text: string) => void;
}

const TextSlider = ({
  placeholder,
  options,
  startKey,
  setStartKey,
  onSlide,
}: TextSliderProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setShowPlaceholder(startKey < 0);
  }, [startKey]);

  const onNextClick = () => {
    const newValue = startKey + 1 >= options.length ? 0 : startKey + 1;
    onSlide && onSlide(options[newValue]);
    setStartKey(newValue);
  };

  const onPrevClick = () => {
    const newValue = startKey - 1 >= 0 ? startKey - 1 : options.length - 1;
    onSlide && onSlide(options[newValue]);
    setStartKey(newValue);
  };

  const onClickHandler = (orientation: 'left' | 'right') => () => {
    setShowPlaceholder(false);
    switch (orientation) {
      case 'left':
        onPrevClick();
        break;

      case 'right':
      default:
        onNextClick();
        break;
    }
  };

  const displayText = showPlaceholder ? placeholder : options[startKey];
  return (
    <div className="text-slider">
      <ArrowButton onClick={onClickHandler('left')} orientation="left" />
      <span className="display">{displayText}</span>
      <ArrowButton onClick={onClickHandler('right')} orientation="right" />
    </div>
  );
};

export default TextSlider;
