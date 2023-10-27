import axios from 'axios';
import { useEffect, useState } from 'react';
import { isEmpty } from 'src/utils/helpers';

async function isNetworkUrlSuccess(fetchUrl, successBaseUrlToReturn) {
  try {
    await axios({ url: fetchUrl, timeout: 4000 });
    return successBaseUrlToReturn;
  } catch (error) {
    return false;
  }
}

export function useValidServiceUrl(serviceURLs) {
  const [validServiceUrl, setValidServiceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isEmpty(serviceURLs)) {
        setIsLoading(true);
        const promises = [];
        for (let i = 0; i < serviceURLs.length; i++) {
          const baseServiceUrl = serviceURLs[i]?.http;
          promises.push(
            isNetworkUrlSuccess(`${baseServiceUrl}/api/v3/index/status`, baseServiceUrl)
          );
        }
        const responses = await Promise.all(promises);
        const serviceUrl = responses.find((response) => response);
        setValidServiceUrl(serviceUrl);
        setIsLoading(false);
      }
    })();
  }, [serviceURLs]);

  return { validServiceUrl, isLoading };
}
