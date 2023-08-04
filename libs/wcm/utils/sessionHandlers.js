import { getSdkError } from '@walletconnect/utils';
import { to } from 'await-to-js';
import { STATUS, ERROR_CASES } from '../constants/lifeCycle';

/**
 * The approval handler for connection proposal
 * @returns {Promise} The promise that resolves when the approval is complete
 */
export const onApprove = async (proposal, selectedAccounts, signClient) => {
  const { id, params } = proposal;
  const { requiredNamespaces, relays } = params;

  // Normalize the information according to requirements of the bridge
  const namespaces = Object.entries(requiredNamespaces).reduce((namespace, [key, value]) => {
    const accounts = value.chains
      .map((chain) => selectedAccounts.map((account) => `${chain}:${account}`))
      .flat();

    namespace[key] = {
      accounts,
      ...value,
    };

    return namespace;
  }, {});

  const [err, response] = await to(
    signClient.approve({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    })
  );

  if (!err) {
    const { acknowledged } = response;
    await acknowledged();
    return STATUS.SUCCESS;
  }
  return STATUS.FAILURE;
};

/**
 * The reject handler for connection proposal
 * @returns {Promise} The promise that resolves when the rejection is complete
 */
export const onReject = (proposal, signClient) => {
  const { id } = proposal;
  return signClient.reject({
    id,
    reason: getSdkError(ERROR_CASES.USER_REJECTED_METHODS),
  });
};
