import React from "react";
import Spritesheet from 'react-responsive-spritesheet';
import { useStore } from '../../store/useStore';

import { Slider, Slide } from "../ui";

interface AvatarSelectorProps {
  title?: string;
  slides: Slide[];
}

const AvatarSelector = ({ title, slides }: AvatarSelectorProps) => {
  const setAvatar = useStore(store => store.setAvatar);
  
  const onSlideChangeHandler = (slide: Slide) => {
    setAvatar(slide.name);
  }
  return (
    <div className="avatar-selector">
      <h2>{title ?? 'Select your avatar'}</h2>
      <Slider slides={slides} onSlideChange={onSlideChangeHandler}>
        {(slide: Slide) => (
          <div className="slide-container" key={slide.name}>
            <Spritesheet
              className="top image"
              image={slide.url}
              widthFrame={64}
              heightFrame={64}
              startAt={getFrameNumber(11, 3)}
              endAt={getFrameNumber(11, 10)}
              steps={7}
              fps={10}
              autoplay={true}
              loop={true}
            />
          </div>
        )}
      </Slider>
    </div>
  )
}

const getFrameNumber = (row, col) => (row - 1) * 13 + (col - 1)

export default AvatarSelector;
