import React from 'react'
import { render } from 'react-dom';

import App from "./App";



// export default new Phaser.Game(config)

const rootElement = document.getElementById("root");
render(<App />, rootElement);
