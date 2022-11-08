import { getSdkError } from '@walletconnect/utils';
import { to } from 'await-to-js';
import { client } from '@libs/wcm/utils/connectionCreator';
import { STATUS, ERROR_CASES } from '../constants/lifeCycle';

/**
 * The approve handler for connection proposal
 *
 * @param {object} proposal The proposal object as received via the event
 * @param {array} selectedAccounts List of lisk addresses selected by the user
 * @returns {Promise} The promise that resolves when the approval is complete
 */
export const onApprove = async (
  proposal, selectedAccounts,
) => {
  const { id, params } = proposal;
  const { requiredNamespaces, relays } = params;

  // Normalize the information according to requirements of the bridge
  const namespaces = Object.entries(requiredNamespaces).reduce((namespace, [key, value]) => {
    const accounts = value.chains.map((chain) => selectedAccounts.map(account => `${chain}:${account}`)).flat();

    namespace[key] = {
      accounts,
      ...value,
    };

    return namespace;
  }, {});

  const [err, response] = await to(client.approve({
    id,
    relayProtocol: relays[0].protocol,
    namespaces,
  }));

  if (!err) {
    const { acknowledged } = response;
    await acknowledged();
    return STATUS.SUCCESS;
  }
  return STATUS.FAILURE;
};

/**
 * The reject handler for connection proposal
 *
 * @param {object} proposal The proposal object as received via the event
 * @returns {Promise} The promise that resolves when the rejection is complete
 */
export const onReject = (proposal) => {
  const { id } = proposal;
  return client.reject({
    id,
    reason: getSdkError(ERROR_CASES.USER_REJECTED_METHODS),
  });
};
