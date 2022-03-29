import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';

import actionTypes from './actions/actionTypes';
import * as reducers from './reducers';
import middleWares from './middlewares';

const App = combineReducers(reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(App, composeEnhancers(applyMiddleware(...middleWares)));

store.dispatch({ type: actionTypes.storeCreated });

// ignore this in coverage as it is hard to test and does not run in production
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = combineReducers(require('./reducers'));
    store.replaceReducer(nextReducer);
  });
}

export * from './selectors';
export default store;
