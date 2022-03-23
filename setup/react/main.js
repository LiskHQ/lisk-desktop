import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { cryptography } from '@liskhq/lisk-client';
import store from '../../../packages/common/store';
import externalLinks from '../../../packages/commoon/utilites/externalLinks';
import updateApp from '../../../packages/updater/utilities/updateApp';
import ipcLocale from '../../../packages/common/utilities/ipcLocale';
import i18n from '../i18n/i18n';
import App from './app';

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () { return `${this.toString()}n`; };

ipcLocale.init(i18n);
updateApp.init();

if (PRODUCTION) {
  externalLinks.init();
}

if (!PRODUCTION) {
  window.cryptography = cryptography;

  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

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

document.documentElement.setAttribute('data-useragent', navigator.userAgent);
