import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { removeTrailingSlash } from 'src/modules/settings/components/customNode/editMode';
import { regex } from 'src/const/regex';
import { addHttp } from 'src/utils/login';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../const/constants';
import { getApplicationConfig } from '../api';

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
export function useSearchApplications(externalApplications, applyFilters, filters) {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(-1);
  const [feedback, setFeedback] = useState('');
  const [urlSearch, setUrlSearch] = useState(false);
  const { t } = useTranslation();

  const searchApplication = async (value) => {
    setUrlSearch(regex.url.test(addHttp(value)));
    // Ensure URL check is up-to-date including while pasting input
    // If URL, ping URL and if successful, then use the URL to get application information
    if (regex.url.test(addHttp(value))) {
      // Ping URL and validate service
      setLoading(true);
      const formattedValue = removeTrailingSlash(addHttp(value));
      await validateAppNode(formattedValue)
        .then(async () => {
          setError(0);
          setFeedback('');
          await externalApplications.loadData({ baseUrl: value });
          setLoading(false);
        })
        .catch(() => {
          setError(1);
          setFeedback(t('Unable to connect to application node. Please check the address and try again'));
          setLoading(false);
        });
    } else {
      setError(-1);
      setFeedback('');
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
    error,
    feedback,
    urlSearch,
    loading,
    searchApplication,
  };
}
