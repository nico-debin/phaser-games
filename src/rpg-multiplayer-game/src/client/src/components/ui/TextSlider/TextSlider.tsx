import React, { useState } from "react";
import ArrowButton from "../ArrowButton";


import "./TextSlider.scss"

interface TextSliderProps {
  placeholder: string;
  options: string[];
  onSlide?: (text: string) => void;
}

const TextSlider = ({ placeholder, options, onSlide }: TextSliderProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [start, setStart] = useState(-1);

  const onNextClick = () => {
    const newValue = start + 1 >= options.length ? 0 : start + 1
    onSlide && onSlide(options[newValue])
    setStart(newValue);
  };

  const onPrevClick = () => {
    const newValue = start - 1 >= 0 ? start - 1 : options.length - 1
    onSlide && onSlide(options[newValue])
    setStart(newValue);
  };

  const onClickHandler = (orientation: 'left' | 'right') => () => {
    setShowPlaceholder(false)
    switch (orientation) {
      case 'left':
        onPrevClick()
        break

      case 'right':
      default:
        onNextClick()
        break
    }
  }

  const displayText = showPlaceholder ? placeholder : options[start];
  return (
    <div className="text-slider">
      <ArrowButton onClick={onClickHandler('left')} orientation="left" />
      <span className='display'>{displayText}</span>
      <ArrowButton onClick={onClickHandler('right')} orientation="right" />
    </div>
  )
}

export default TextSlider