import React from "react";
import { useStore } from "~/store/useStore";

import "./PlayButton.scss";

interface PlayButtonProps {

}

const PlayButton = ({}: PlayButtonProps) => {
  const setGameStarted = useStore(store => store.setGameStarted);

  const onClickHandler = () => {
    setGameStarted(true);
  }

  return (
    <div className="play-button" onClick={onClickHandler}>
      <div className="green-wood">
        <span className="play-icon"></span>
      </div>
      <div className="wood">
      </div>
      <label>Play!</label>
    </div>
  )
};

export default PlayButton;