import React, { useEffect } from 'react';
import gameConfig from '../phaser-client/gameConfig';

const GamePage = () => {
  useEffect(() => new Phaser.Game(gameConfig), []);

  return <></>;
};

export default GamePage;
