import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';

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
  if (proposal) {
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

    const { acknowledged } = await client.approve({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    });
    await acknowledged();
  }
};

/**
 * The reject handler for connection proposal
 *
 * @param {object} proposal The proposal object as received via the event
 * @returns {Promise} The promise that resolves when the rejection is complete
 */
export const onReject = async (proposal) => {
  if (proposal) {
    const { id } = proposal;
    await client.reject({
      id,
      reason: getSdkError('USER_REJECTED_METHODS'),
    });
  }
};
