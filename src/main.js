import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';

const rootElement = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <App store={store} />
  </Provider>
  , rootElement);

if (module.hot) {
  module.hot.accept('./components/app', () => {
    const NextRootContainer = require('./components/app').default;
    ReactDOM.render(
      <Provider store={store}>
        <NextRootContainer store={store} />
      </Provider>
      , rootElement);
  });
}
