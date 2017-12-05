import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import throttle from 'lodash.throttle';

import { setSavedAccounts, setLastActiveAccount } from '../utils/savedAccounts';
import * as reducers from './reducers';
import middleWares from './middlewares';

const App = combineReducers(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(App, composeEnhancers(applyMiddleware(...middleWares)));

// ignore this in coverage as it is hard to test and does not run in production
/* istanbul ignore if */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = combineReducers(require('./reducers'));
    store.replaceReducer(nextReducer);
  });
}

store.subscribe(throttle(() => {
  const savedAccounts = store.getState();
  if (savedAccounts && savedAccounts.lastActive) {
    setSavedAccounts(savedAccounts.accounts);
    setLastActiveAccount(savedAccounts.lastActive);
  }
}, 1000));

export default store;
