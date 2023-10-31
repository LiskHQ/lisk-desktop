import { useEffect, useState } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { Client } from 'src/utils/api/client';

async function isNetworkUrlSuccess(fetchUrl, successBaseUrlToReturn) {
  try {
    const client = new Client({ http: fetchUrl });
    await client.rest();
    return successBaseUrlToReturn;
  } catch (error) {
    return false;
  }
}

export async function resolveApiValidity(serviceURLs) {
  const promises = [];
  for (let i = 0; i < serviceURLs.length; i++) {
    const baseServiceUrl = serviceURLs[i]?.http;
    promises.push(isNetworkUrlSuccess(`${baseServiceUrl}/api/v3/index/status`, baseServiceUrl));
  }
  const responses = await Promise.all(promises);
  return responses.find((response) => response);
}

/* istanbul ignore next */
export function useValidServiceUrl(serviceURLs) {
  const [validServiceUrl, setValidServiceUrl] = useState('');
  const [isLoading, setIsLoading] = useState(!!serviceURLs);

  useEffect(() => {
    (async () => {
      if (!isEmpty(serviceURLs)) {
        setIsLoading(true);
        const serviceUrl = await resolveApiValidity(serviceURLs);
        setValidServiceUrl(serviceUrl);
        setIsLoading(false);
      }
    })();
  }, [serviceURLs]);

  return { validServiceUrl, isLoading };
}
