import React, { useEffect, useState } from "react";

import ArrowButton from "../ArrowButton";

import "./Slider.scss";

export type Slide = {
  name: string;
  url: string;
  isVoter?: boolean;
  isAdmin?: boolean;
};

type Props = {
  slides: Slide[];
  children: (props: any) => JSX.Element;
  onSlideChange?: (slide: Slide) => void;
};

const Slider = ({ slides, children, onSlideChange = () => null }: Props) => {
  const [start, setStart] = useState(0);

  const setStartWrapper = (index: number) => {
    setStart(index);
    onSlideChange(slides[index]);
  };

  useEffect(() => {
    setStartWrapper(0);
  }, [slides]);

  const visibleSlide = slides[start];

  const onNextClick = () => {
    setStartWrapper(start + 1 >= slides.length ? 0 : start + 1);
  };

  const onPrevClick = () => {
    setStartWrapper(start - 1 >= 0 ? start - 1 : slides.length - 1);
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
        <span>{slides[start].name}</span>
      </div>
    </div>
  );
};

export default Slider;
