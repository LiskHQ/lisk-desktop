import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n'; // initialized i18next instance

export const prepareStore = (reducers, Middlewares) => {
  const ApplyedMiddlewares = Middlewares ? applyMiddleware(Middlewares) : {};
  const App = combineReducers(reducers, ApplyedMiddlewares);
  return createStore(App, ApplyedMiddlewares);
};

export const renderWithRouter = (Component, store) =>
  <Provider store={ store }>
    <Router>
      <I18nextProvider i18n={ i18n }>
        <Component />
      </I18nextProvider>
    </Router>
  </Provider>;
