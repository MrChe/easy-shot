import React from 'react';
import ReactDOM from 'react-dom';
import { Sniper } from './components/Sniper/Sniper';
import './app.scss';

const mainElement = document.createElement('div');
mainElement.id = 'root';
document.body.appendChild(mainElement);

const App = () => {
  return (
      <Sniper />
  )
}

ReactDOM.render(<App />, mainElement);
