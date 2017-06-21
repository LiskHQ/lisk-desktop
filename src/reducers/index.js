import { createStore, combineReducers } from 'redux';
import logger from 'redux-logger'
import account from './account';

const App = combineReducers({
    ...account,
});

const store = createStore(App, applyMiddleware(logger));

export default store;
