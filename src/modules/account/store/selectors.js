export const selectCurrentAccount = (state) => state.account.current;
export const selectAccounts = (state) => state.account.list || [];
export const selectAccountNonce = (state) => state.account.localNonce || {};
