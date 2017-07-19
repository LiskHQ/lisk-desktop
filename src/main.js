import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';

const rootElement = document.getElementById('app');

const renderWithRouter = Component =>
  <Provider store={store}>
    <Router>
      <Component store={store} />
    </Router>
  </Provider>;

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./components/app', () => {
    const NextRootContainer = require('./components/app').default;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}
