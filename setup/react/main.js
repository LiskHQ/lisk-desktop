import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import { externalLinks } from 'src/utils/externalLinks';
import { cryptography } from '@liskhq/lisk-client';
import { store, persistedStore } from 'src/redux/store';
import ipcLocale from 'src/utils/ipcLocale';
import updateApp from '@update/utils/updateApp';
import i18n from 'src/utils/i18n/i18n';
import App from './app';
import ApplicationBootstrap, { ApplicationBootstrapContext } from './app/ApplicationBootstrap';

// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return `${this.toString()}n`;
};

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
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const rootElement = document.getElementById('app');

const renderWithRouter = (Component) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <ApplicationBootstrap>
          <ApplicationBootstrapContext.Consumer>
            {(networkEventStatus) => (
              <>
                <Router>
                  <I18nextProvider i18n={i18n}>
                    <Component {...networkEventStatus} />
                  </I18nextProvider>
                </Router>
                <ReactQueryDevtools />
              </>
            )}
          </ApplicationBootstrapContext.Consumer>
        </ApplicationBootstrap>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);

ReactDOM.render(renderWithRouter(App), rootElement);

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextRootContainer = require('./app').DevApp;
    ReactDOM.render(renderWithRouter(NextRootContainer), rootElement);
  });
}

document.documentElement.setAttribute('data-useragent', navigator.userAgent);
