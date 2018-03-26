import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import throttle from 'lodash.throttle';

import actionTypes from '../constants/actions';
import * as reducers from './reducers';
import middleWares from './middlewares';
import savedAccountsSubscriber from './subscribers/savedAccounts';

const App = combineReducers(reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(App, composeEnhancers(applyMiddleware(...middleWares)));

store.dispatch({ type: actionTypes.storeCreated });
store.subscribe(throttle(savedAccountsSubscriber.bind(null, store), 1000));

// ignore this in coverage as it is hard to test and does not run in production
/* istanbul ignore if */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = combineReducers(require('./reducers'));
    store.replaceReducer(nextReducer);
  });
}

export default store;
