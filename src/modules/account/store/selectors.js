// eslint-disable-next-line import/prefer-default-export
export const selectCurrentAccount = state => state.account.current;
export const selectAccounts = state => Object.values(state.account.list);
