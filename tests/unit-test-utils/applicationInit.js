import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'src/utils/i18n/i18n'; // initialized i18next instance

const queryClient = new QueryClient();
export const prepareStore = (reducers, middlewares) => {
  const ApplyedMiddlewares = middlewares ? compose(applyMiddleware(...middlewares)) : {};
  const App = combineReducers(reducers);
  return createStore(App, ApplyedMiddlewares);
};

export const renderWithRouter = (Component, store, props) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router>
        <I18nextProvider i18n={i18n}>
          <Component {...props} />
        </I18nextProvider>
      </Router>
    </Provider>
  </QueryClientProvider>
);
