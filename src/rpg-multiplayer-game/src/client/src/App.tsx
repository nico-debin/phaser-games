import React from 'react';
import { useStore } from './store/useStore';

import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';

const App = () => {
  const gameStarted = useStore(store => store.gameStarted);

  return (
    <>
      {!gameStarted && <HomePage />}
      {gameStarted && <GamePage />}
    </>
  );
};

export default App;
