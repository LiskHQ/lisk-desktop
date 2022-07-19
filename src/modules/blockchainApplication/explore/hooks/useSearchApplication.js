/* eslint-disable max-statements */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectNetwork } from 'src/redux/selectors';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../const/constants';
import { getFilteredOffChainApplications, getApplications } from '../api';

// const validateAppNode = async (application) => {
//   // Implement validation function
//   try {
//     const response = await getAppNetworkConfig(
//       {
//         name: application.name,
//         address: application.serviceURLs[0],
//       },
//     );
//     if (response) {
//       return true;
//     }
//     throw new Error(
//       `Failed to return response for application url: ${application.name}`,
//     );
//   } catch (err) {
//     throw new Error(
//       `Error getting details for application: ${application.name}: ${err.message}`,
//     );
//   }
// };

// eslint-disable-next-line import/prefer-default-export
export async function useSearchApplications(applyFilters, filters) {
  const network = useSelector(selectNetwork);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  // check if URL or not
  const urlSearch = searchValue.startsWith('http');
  // If not URL, call application list endpoint (/apps/list)
  // If URL, ping URL and if successful, then use the URL to get information
  // Use custom hooks to manage the search
  if (urlSearch) {
    // ping URL and validate service
    setLoading(true);
    await getFilteredOffChainApplications({ network, params: { search: searchValue } });
    setLoading(false);
  } else {
    applyFilters({
      ...filters,
      search: searchValue,
      offset: 0,
      limit: BLOCKCHAIN_APPLICATION_LIST_LIMIT,
    });
    // const appsList = getApplications({ network, params: { isDefault: false } });
    // appsList.filter(app => app.name.includes(searchValue));
  }

  return {
    searchValue,
    setSearchValue,
    urlSearch,
    loading,
  };
}
