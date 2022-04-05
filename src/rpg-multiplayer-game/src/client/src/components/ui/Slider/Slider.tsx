import React, { ReactChild, useEffect, useState } from 'react';

import ArrowButton from '../ArrowButton';

import './Slider.scss';

export type Slide = {
  name: string;
  url: string;
  isVoter?: boolean;
  isAdmin?: boolean;
};

type Props = {
  slides: Slide[];
  startKey: number;
  setStartKey: (key: number) => void;
  onSlideChange?: (slide: Slide) => void;
  children?: ReactChild;
};

const Slider = ({
  slides,
  startKey,
  setStartKey,
  children,
  onSlideChange = () => null,
}: Props) => {
  const [preventSlideReset, setPreventSlideReset] = useState<boolean>(true);

  const setStartWrapper = (index: number) => {
    setStartKey(index);
    onSlideChange(slides[index]);
  };

  useEffect(() => {
    preventSlideReset ? setPreventSlideReset(false) : setStartWrapper(0);
  }, [slides]);

  const visibleSlide = slides[startKey];

  const onNextClick = () => {
    setStartWrapper(startKey + 1 >= slides.length ? 0 : startKey + 1);
  };

  const onPrevClick = () => {
    setStartWrapper(startKey - 1 >= 0 ? startKey - 1 : slides.length - 1);
  };

  return (
    <div className="slider">
      <div className="slides">
        <ArrowButton orientation="left" onClick={onPrevClick} />

        <ul className="list">
          {visibleSlide && children ? children(visibleSlide) : null}
        </ul>

        <ArrowButton orientation="right" onClick={onNextClick} />
      </div>
      <div className="slides-info">
        <span>{slides[startKey].name}</span>
      </div>
    </div>
  );
};

export default Slider;
