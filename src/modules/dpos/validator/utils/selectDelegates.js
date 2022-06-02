import { filterDelegates } from './filterDelegates';

// eslint-disable-next-line import/prefer-default-export
export const selectDelegates = ({
  activeTab,
  delegates,
  standByDelegates,
  sanctionedDelegates,
  watchedDelegates,
  filters,
  watchList,
}) => {
  switch (activeTab) {
    case 'active':
      return filterDelegates(delegates, filters);

    case 'standby':
      return filterDelegates(standByDelegates, filters);

    case 'sanctioned':
      return filterDelegates(sanctionedDelegates, filters);

    case 'watched':
      return filterDelegates(watchedDelegates, {
        search: filters.search || '',
        address: watchList,
      });

    default:
      return undefined;
  }
};
