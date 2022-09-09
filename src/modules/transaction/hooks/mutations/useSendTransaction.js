import { useMutation } from '@tanstack/react-query';
import { METHOD, API_VERSION, API_METHOD } from 'src/const/config';

/**
 * Creates a custom hook for Send Transaction mutation
 *
 * @param {object} configuration - the custom mutation configuration object
 * @param {object} configuration.config - the mutation config
 * @param {object} configuration.config.params - the mutation config params
 * @param {string} [configuration.config.params.moduleCommandID] - transaction's moduleCommandID
 * @param {string} [configuration.config.params.moduleCommandName] - transaction's moduleCommandName
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useSendTransaction = ({ config: customConfig = {}, options } = {}) =>
  useMutation(async (data) => {
    const config = {
      url: `/api/${API_VERSION}/transactions/`,
      method: 'post',
      event: 'post.transactions',
      ...customConfig,
      data,
    };
    return API_METHOD[METHOD](config);
  }, options);
