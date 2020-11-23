import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
// import { Router } from 'react-router';
import { Routes } from '../Routes';

// const history = createBrowserHistory();

const Root = () => {
  return (
    <Router>
      <Routes />;
    </Router>
  );
};

export default hot(Root);
