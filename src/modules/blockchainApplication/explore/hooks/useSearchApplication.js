import { useState } from 'react';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../const/constants';
import { getFilteredOffChainApplications, getApplicationConfig } from '../api';

const validateAppNode = async (serviceUrl) => {
  try {
    const response = await getApplicationConfig({ serviceUrl });
    if (response) {
      return true;
    }
    throw new Error(
      `Failed to return response for application url: ${serviceUrl}`,
    );
  } catch (err) {
    throw new Error(
      `Error getting details for application url: ${serviceUrl}: ${err.message}`,
    );
  }
};

// eslint-disable-next-line import/prefer-default-export
export function useSearchApplications(applyFilters, filters) {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  // Check if search value is URL or not
  const urlSearch = searchValue.startsWith('http');
  // If not URL, call application list endpoint (/apps/list)
  // If URL, ping URL and if successful, then use the URL to get information
  // Use custom hooks to manage the search
  const searchApplication = async (value) => {
    if (urlSearch) {
      // Ping URL and validate service
      setLoading(true);
      const formattedValue = removeTrailingSlash(value);
      await validateAppNode(formattedValue)
        .then(async () => {
          await getFilteredOffChainApplications({ baseUrl: value, params: { search: value } });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      applyFilters({
        ...filters,
        search: value,
        offset: 0,
        limit: BLOCKCHAIN_APPLICATION_LIST_LIMIT,
      });
    }
  };

  return {
    searchValue,
    setSearchValue,
    urlSearch,
    loading,
    searchApplication,
  };
}
