import { createStore, combineReducers } from 'redux';
import account from './account';

const App = combineReducers({
    ...account,
});

const store = createStore(App);

export default store;
