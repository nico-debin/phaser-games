import React, { useEffect, useState } from "react";

import ArrowButton from "../ArrowButton";

import "./Slider.scss";

export type Slide = {
  name: string;
  url: string;
};

type Props = {
  slides: Slide[];
  children: (props: any) => JSX.Element;
  onSlideChange?: (slide: Slide) => void;
};

const Slider = React.memo<Props>(
  ({ slides, children, onSlideChange = () => null }) => {
    const [start, setStart] = useState(0);

    const setStartWrapper = (index: number) => {
      setStart(index);
      onSlideChange(slides[index]);
    }

    useEffect(() => {
      // setStart(0)
      setStartWrapper(0);
    }, [slides])

    const visibleSlide = slides[start];

    const onNextClick = () => {
      // const newIndex = start + 1 >= slides.length ? 0 : start + 1;
      // setStart(newIndex);
      // onSlideChange(slides[newIndex]);
      setStartWrapper(start + 1 >= slides.length ? 0 : start + 1)
    };

    const onPrevClick = () => {
      // const newIndex = start - 1 >= 0 ? start - 1 : slides.length - 1;
      // setStart(newIndex);
      // onSlideChange(slides[newIndex]);
      setStartWrapper(start - 1 >= 0 ? start - 1 : slides.length - 1);
    };

    return (
      <div className="slider">
        <div className="slides">
          <ArrowButton orientation="left" onClick={onPrevClick} />

          <ul className="list">
            {
              visibleSlide && children ? children(visibleSlide) : null
            }
          </ul>

          <ArrowButton orientation="right" onClick={onNextClick} />
        </div>
        <div className="slides-info">
          <span>{slides[start].name}</span>
        </div>
      </div>
    );
  }
);

export default Slider;
