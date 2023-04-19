import { useState, useCallback, useRef, useEffect } from 'react';
import { Client } from 'src/utils/api/client';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { regex } from 'src/const/regex';
import { addHttp } from 'src/utils/login';
import { useNetworkStatus } from '@network/hooks/queries';

export const useSearchApplications = () => {
  const [url, setUrl] = useState({
    isUrl: false,
    urlStatus: '',
    isSearchLoading: false,
  });
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const timeout = useRef();

  const setDebounceSearch = (value) => {
    setSearchValue(value);
    clearTimeout(timeout.current);
    // Validate the URL with debouncer
    timeout.current = setTimeout(() => {
      setDebouncedSearchValue(value);
    }, 500);
  };
  const formattedValue = removeTrailingSlash(addHttp(debouncedSearchValue));
  const {
    isLoading,
    isSuccess: networkSuccess,
    isError: networkError,
  } = useNetworkStatus({
    client: new Client({ http: formattedValue }),
    config: { appUrl: formattedValue },
    options: { enabled: !!url.isUrl && regex.url.test(formattedValue) },
  });

  const onSearchApplications = useCallback(
    (value) => {
      const isUrl = regex.url.test(addHttp(value));
      setDebounceSearch(value);
      setUrl((state) => ({
        ...state,
        isUrl,
      }));
      // Ensure URL check is up-to-date including while pasting input
      // If URL, ping URL and if successful, then use the URL to get application information
      if (isUrl) {
        setUrl({ ...url, isUrl, isSearchLoading: true });
      }
    },
    [setSearchValue, setUrl]
  );

  useEffect(() => {
    const isSearchValueUrl = regex.url.test(addHttp(debouncedSearchValue));
    if (url.isUrl) {
      if (networkError) {
        setUrl({
          urlStatus: 'error',
          isUrl: isSearchValueUrl,
          isSearchLoading: false,
        });
      }
      if (networkSuccess) {
        setUrl({
          urlStatus: 'ok',
          isUrl: isSearchValueUrl,
          isSearchLoading: false,
        });
      }
    }
  }, [debouncedSearchValue, isLoading]);
  return {
    searchValue,
    debouncedSearchValue,
    onSearchApplications,
    ...url,
  };
};
