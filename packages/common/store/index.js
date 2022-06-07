import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist';
import actionTypes from './actions/actionTypes';
import * as reducers from './reducers';
import middleWares from './middlewares';

export * from './selectors';

const rootReducer = combineReducers(reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleWares)));
store.dispatch({ type: actionTypes.storeCreated });
const persistedStore = persistStore(store);

// ignore this in coverage as it is hard to test and does not run in production
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextReducer = combineReducers(require('./reducers'));
    store.replaceReducer(nextReducer);
  });
}

export {
  storage,
  store,
  persistedStore,
};

export default store;
