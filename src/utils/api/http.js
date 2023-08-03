import client from 'src/utils/api/client';

const http = ({
  baseUrl: baseURL,
  path: url,
  params,
  method = 'GET',
  ...restOptions
  // eslint-disable-next-line consistent-return
}) => {
  try {
    /* istanbul ignore next */
    const transformResult = async (response) => {
      if (!response.ok) {
        const { message } = await response.json();
        const error = new Error(response.statusText);
        error.code = response.status;
        error.message = message;
        throw error;
      }
      return response.json();
    };
    const config = {
      baseURL,
      url,
      method,
      params,
      transformResult,
      ...restOptions,
    };

    return client.rest(config);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
};

export default http;
