import { useState, useCallback, useRef } from 'react';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { regex } from 'src/const/regex';
import { addHttp } from 'src/utils/login';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { validateAppNode } from '../utils';

export const useSearchApplications = () => {
  const [URL, setURL] = useState({
    isURL: false,
    URLStatus: '',
  });
  const [searchValue, setSearchValue] = useState('');
  const timeout = useRef();

  const setDebounceSearch = (value) => {
    setSearchValue(value);
    clearTimeout(timeout.current);
    // Validate the URL with debouncer
    timeout.current = setTimeout(() => {
      setSearchValue(value);
    }, 500);
  };
  const onSearchApplications = useCallback(
    (value) => {
      const isURL = regex.url.test(addHttp(value));
      setDebounceSearch(value);
      setURL((state) => ({
        ...state,
        isURL,
      }));
      // Ensure URL check is up-to-date including while pasting input
      // If URL, ping URL and if successful, then use the URL to get application information
      if (isURL) {
        // Ping URL and validate service
        const formattedValue = removeTrailingSlash(addHttp(value));
        validateAppNode(formattedValue)
          .then(() => {
            setURL({
              URLStatus: 'ok',
              isURL,
            });
          })
          .catch(() => {
            setURL({
              URLStatus: 'error',
              isURL,
            });
          });
      }
    },
    [setSearchValue, setURL]
  );

  if (URL.isURL) {
    // const result = useQuery()
    const result = {
      isLoading: true,
      error: false,
      data: [mockApplicationsExplore[0]],
    };
    return {
      ...result,
      searchValue,
      ...URL,
      onSearchApplications,
    };
  }

  // const result = useQuery()
  const result = {
    isLoading: false,
    error: false,
    data: mockApplicationsExplore,
  };
  return {
    ...result,
    searchValue,
    ...URL,
    onSearchApplications,
  };
};
