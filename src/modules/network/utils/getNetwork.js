import { useTranslation } from 'react-i18next';
import networks, { networkKeys } from '@network/configuration/networks';
import { DEFAULT_NETWORK } from 'src/const/config';

export const getNetworksList = () => {
  const { t } = useTranslation();
  return Object.values(networkKeys).map((name) => ({
    label: t(networks[name].label),
    name,
  }));
};

export const getNetworkName = (network = {}) => network?.name || DEFAULT_NETWORK;

/**
 * Returns human readable error messages
 *
 * @param {Object} error
 * @param {String} error.message - The error message received from network API call
 * @returns {String} - The human readable error message.
 */
export const getConnectionErrorMessage = (error) => {
  const { t } = useTranslation();
  return error && error.message
    ? t(`Unable to connect to the node, Error: ${error.message}`)
    : t('Unable to connect to the node, no response from the server.');
};
