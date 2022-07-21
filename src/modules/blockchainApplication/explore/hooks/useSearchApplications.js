import { useState, useCallback, useRef } from 'react';
// import { useTranslation } from 'react-i18next';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { regex } from 'src/const/regex';
import { addHttp } from 'src/utils/login';
// import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../const/constants';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import { validateAppNode } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export const useSearchApplications = () => {
  const [URl, setURl] = useState({
    isURL: false,
    URLStatus: '',
  });
  const [searchValue, setSearchValue] = useState('');
  // const { t } = useTranslation();
  const timeout = useRef();

  const setDebounceSearch = (value) => {
    setSearchValue(value);
    clearTimeout(timeout.current);
    // Validate the URL with debouncer
    timeout.current = setTimeout(() => {
      setSearchValue(value);
    }, 500);
  };
  const onSearchApplications = useCallback(({ target: { value } }) => {
    const isURL = regex.url.test(addHttp(value));
    setDebounceSearch(value);
    setURl((state) => ({
      ...state,
      isURL,
    }));
    // Ensure URL check is up-to-date including while pasting input
    // If URL, ping URL and if successful, then use the URL to get application information
    if (isURL) {
      // Ping URL and validate service
      const formattedValue = removeTrailingSlash(addHttp(value));
      validateAppNode(formattedValue)
        .then(async () => {
          setURl({
            URLStatus: 'ok',
            isURL,
          });
        })
        .catch(() => {
          setURl({
            URLStatus: 'error',
            isURL,
          });
        });
    }
  }, [setSearchValue, setURl]);

  if (URl.isURL) {
    // const result = useQuery()
    const result = {
      isLoading: true,
      error: false,
      data: [mockApplicationsExplore[0]],
    };
    return {
      ...result,
      searchValue,
      ...URl,
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
    ...URl,
    onSearchApplications,
  };
};
