import { createStore, combineReducers } from 'redux';
import logger, { applyMiddleware } from 'redux-logger';
import account from './account';

const App = combineReducers({
  ...account,
});

const store = createStore(App, applyMiddleware(logger));

export default store;
