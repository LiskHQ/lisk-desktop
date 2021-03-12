import { apiClient } from '@liskhq/lisk-client';
import { networkKeys } from 'constants';

// eslint-disable-next-line import/prefer-default-export
export const getApiClient = async () => {
  const client = await apiClient.createWSClient('ws://localhost:5001/ws');

  return client;
};
