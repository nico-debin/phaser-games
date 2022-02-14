import React from "react";
import { useStore } from "../../store/useStore";
import { SavedSettings } from "../../types";

import "./PlayButton.scss";

interface PlayButtonProps {

}

const PlayButton = ({}: PlayButtonProps) => {
  const store = useStore();

  const onClickHandler = () => {
    const savedSettings: SavedSettings = {
      username: store.username,
      avatar: store.avatar,
      isVoter: store.isVoter,
      isAdmin: store.isAdmin,
    };
    localStorage.setItem('grooming-wars', JSON.stringify(savedSettings))
    store.setGameStarted(true);
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