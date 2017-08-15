import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as reducers from './reducers';
import env from '../constants/env';

// Create Logger if not in production mode
const middleWares = [];
// ignore this in coverage as it is hard to test and does not run in production
/* istanbul ignore if */
if (env.development) {
  const { logger } = require('redux-logger');
  middleWares.push(logger);
}

const App = combineReducers(reducers);

const store = createStore(App, applyMiddleware(...middleWares));

// ignore this in coverage as it is hard to test and does not run in production
/* istanbul ignore if */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = combineReducers(require('./reducers'));
    store.replaceReducer(nextReducer);
  });
}

export default store;
