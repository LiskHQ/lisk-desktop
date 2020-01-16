import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { applyDeviceClass } from './utils/applyDeviceClass';
import App from './app';
import store from './store';
import i18n from './i18n'; // initialized i18next instance
import externalLinks from './utils/externalLinks';
import env from './constants/env';
import ipcLocale from './utils/ipcLocale';
import newRelease from './utils/newRelease';

if (env.development) {
  const whyDidYouRender = require('@welldone-software/why-did-you-render'); //eslint-disable-line
  whyDidYouRender(React);
}

if (env.production) {
  externalLinks.init();
}

if (!env.test) {
  ipcLocale.init(i18n);
}

newRelease.init();

const rootElement = document.getElementById('app');

const renderWithRouter = Component => (
  <Provider store={store}>
    <Router>
      <I18nextProvider i18n={i18n}>
        <Component />
      </I18nextProvider>
    </Router>
  </Provider>
);

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextRootContainer = require('./app').DevApp;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}

applyDeviceClass(document.getElementsByTagName('html')[0], navigator);
