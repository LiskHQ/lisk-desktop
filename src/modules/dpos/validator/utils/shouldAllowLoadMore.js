// eslint-disable-next-line import/prefer-default-export
export const shouldAllowLoadMore = (
  activeTab,
  standByDelegates,
  sanctionedDelegates,
) => {
  if (activeTab === 'standby') {
    return (
      standByDelegates.meta?.offset + standByDelegates.meta?.count
      < standByDelegates.meta?.total
    );
  }
  if (activeTab === 'sanctioned') {
    return (
      sanctionedDelegates.meta?.offset + sanctionedDelegates.meta?.count
      < sanctionedDelegates.meta?.total
    );
  }

  return false;
};
