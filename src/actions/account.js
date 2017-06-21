import store from '../reducers';

/**
 * 
 * 
 */
export const setAccount = (data) => {
    store.dispatch({
        data
        type: 'SET_ACCOUNT',
    });
};

/**
 * 
 * 
 */
export const resetAccount = () => {
    store.dispatch({
        type: 'RESET_ACCOUNT',
    });
};
