import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist';
import actionTypes from 'src/modules/common/store/actionTypes';
import * as reducers from 'src/redux/rootReducer';
import middleWares from 'src/redux/middlewares';

export * from 'src/redux/selectors';

const rootReducer = combineReducers(reducers);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleWares)));
store.dispatch({ type: actionTypes.storeCreated });
const persistedStore = persistStore(store);

// ignore this in coverage as it is hard to test andk does not run in production
if (module.hot) {
  module.hot.accept('src/redux/rootReducer', () => {
    const nextReducer = combineReducers(require('src/redux/rootReducer'));
    store.replaceReducer(nextReducer);
  });
}

export { storage, store, persistedStore };
