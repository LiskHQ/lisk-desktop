export const filterDelegates = (delegates, filters) => ({
  ...delegates,
  data:
    filters.search || filters.address
      ? delegates.data.filter(
        (delegate) =>
          delegate.username.includes(filters.search)
          && (!filters.address || filters.address.includes(delegate.address)),
      )
      : delegates.data,
});
