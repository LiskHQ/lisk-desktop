import { createStore, combineReducers, applyMiddleware } from 'redux';
import account from './account';
import env from '../constants/env';

// Create Logger if not in production mode
const middleWares = [];
if (env.development) {
  const { logger } = require('redux-logger');
  middleWares.push(logger);
}

const App = combineReducers({
  account,
});

const store = createStore(App, applyMiddleware(...middleWares));

export default store;
