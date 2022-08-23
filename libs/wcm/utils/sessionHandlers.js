import { getSdkError } from '@walletconnect/utils';
import { to } from 'await-to-js';
import { client } from '@libs/wcm/utils/connectionCreator';
import { PAIRING_PROPOSAL_STATUS, ERROR_CASES } from '../data/chainConfig';

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
  const namespaces = Object.keys(requiredNamespaces).reduce((nms, key) => {
    const accounts = requiredNamespaces[key].chains.reduce((acc, chain) => {
      selectedAccounts.forEach((account) => {
        acc.push(`${chain}:${account}`);
      });

      return acc;
    }, []);

    nms[key] = {
      accounts,
      methods: requiredNamespaces[key].methods,
      events: requiredNamespaces[key].events,
    };

    return nms;
  }, {});

  const [err, response] = await to(client.approve({
    id,
    relayProtocol: relays[0].protocol,
    namespaces,
  }));

  if (!err) {
    const { acknowledged } = response;
    await acknowledged();
    return PAIRING_PROPOSAL_STATUS.SUCCESS;
  }

  return PAIRING_PROPOSAL_STATUS.ERROR;
};

/**
 * The reject handler for connection proposal
 *
 * @param {object} proposal The proposal object as received via the event
 * @returns {Promise} The promise that resolves when the rejection is complete
 */
export const onReject = async (proposal) => {
  const { id } = proposal;
  await client.reject({
    id,
    reason: getSdkError(ERROR_CASES.USER_REJECTED_METHODS),
  });
};
