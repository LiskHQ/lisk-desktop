import React from 'react';
import { render } from 'react-dom';
import App from './app';

const rootEl = document.getElementById('app');
render(<App />, rootEl);

if (module.hot) {
  module.hot.accept('./app.js', () => {
    const NextRootContainer = require('./app.js').default;
    render(<NextRootContainer />, rootEl);
  });
}
