import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../src/i18n'; // initialized i18next instance

export const prepareStore = (reducers, middlewares) => {
  const ApplyedMiddlewares = middlewares ? compose(applyMiddleware(...middlewares)) : {};
  const App = combineReducers(reducers);
  return createStore(App, ApplyedMiddlewares);
};

export const renderWithRouter = (Component, store, props) =>
  <Provider store={ store }>
    <Router>
      <I18nextProvider i18n={ i18n }>
        <Component { ...props }/>
      </I18nextProvider>
    </Router>
  </Provider>;
