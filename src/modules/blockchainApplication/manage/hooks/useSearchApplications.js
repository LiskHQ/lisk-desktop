import { useState, useCallback, useRef } from 'react';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { regex } from 'src/const/regex';
import { addHttp } from 'src/utils/login';
import { validateAppNode } from '../utils';

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
        // Ping URL and validate service
        const formattedValue = removeTrailingSlash(addHttp(value));
        setUrl({ ...URL, isSearchLoading: true });
        validateAppNode(formattedValue)
          .then(() => {
            setUrl({
              urlStatus: 'ok',
              isUrl,
              isSearchLoading: false,
            });
          })
          .catch(() => {
            setUrl({
              urlStatus: 'error',
              isUrl,
              isSearchLoading: false,
            });
          });
      }
    },
    [setSearchValue, setUrl]
  );

  return {
    searchValue,
    debouncedSearchValue,
    onSearchApplications,
    ...url,
  };
};
