import { getSdkError } from '@walletconnect/utils';
import { client } from '@libs/wcm/utils/connectionCreator';

export async function onApprove(
  proposal, selectedAccounts,
) {
  if (proposal) {
    const { id, params } = proposal;
    const { /* proposer, */ requiredNamespaces, relays } = params;
    const namespaces = {};
    Object.keys(requiredNamespaces).forEach(key => {
      const accounts = [];
      requiredNamespaces[key].chains.forEach((chain) => {
        selectedAccounts[key].map(acc => accounts.push(`${chain}:${acc}`));
      });
      namespaces[key] = {
        accounts,
        methods: requiredNamespaces[key].methods,
        events: requiredNamespaces[key].events,
      };
    });

    const { acknowledged } = await client.approve({
      id,
      relayProtocol: relays[0].protocol,
      namespaces,
    });
    await acknowledged();
  }
}

// Handle reject action
export async function onReject(proposal) {
  if (proposal) {
    const { id } = proposal;
    await client.reject({
      id,
      reason: getSdkError('USER_REJECTED_METHODS'),
    });
  }
}
