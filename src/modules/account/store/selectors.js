export const selectCurrentAccount = (state) => state.account.current;
export const selectAccounts = (state) => state.account.list || [];
