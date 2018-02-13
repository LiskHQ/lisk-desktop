import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { applyDeviceClass } from './utils/applyDeviceClass';
import history from './history';
import App from './components/app';
import store from './store';
import i18n from './i18n'; // initialized i18next instance
import proxyLogin from './utils/proxyLogin';
import externalLinks from './utils/externalLinks';
import env from './constants/env';
import ipcLocale from './utils/ipcLocale';

if (env.production) {
  proxyLogin.init();
  ipcLocale.init(i18n);
  externalLinks.init();
}

const rootElement = document.getElementById('app');



let basename = '/hub';
// const initialUrl = '/main/dashboard';
if (env.production) {
  basename = document.location.href.replace('file://', '').concat(basename);
  // basename = `${window.location.pathname}/hub`;
  console.log('PRODUCITON: \n', document.location.href);
}
const historyObj = history({ basename });

// console.log('HISTORY.STATE', window.history);
// console.log('HISTORY.STATE', Object.keys(window.history));
// console.log('HISTORY.STATE', Object.keys(history));

// historyObj.push(initialUrl);

const renderWithRouter = Component =>
  <Provider store={store}>
    <Router history={historyObj}>
      <I18nextProvider i18n={ i18n }>
        <Component />
      </I18nextProvider>
    </Router>
  </Provider>;

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./components/app', () => {
    const NextRootContainer = require('./components/app').default;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}

applyDeviceClass(document.getElementsByTagName('html')[0], navigator);

