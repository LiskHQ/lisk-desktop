import { requestToActivePeer } from './peers';

export const listAccountDelegates = (activePeer, address) =>
  requestToActivePeer(activePeer, 'accounts/delegates', { address });


export const listDelegates = (activePeer, options) =>
  requestToActivePeer(activePeer, `delegates/${options.q ? 'search' : ''}`, options);

export const getDelegate = (activePeer, options) =>
  requestToActivePeer(activePeer, 'delegates/get', options);

export const vote = (activePeer, secret, publicKey, voteList, unvoteList, secondSecret = null) =>
  requestToActivePeer(activePeer, 'accounts/delegates', {
    secret,
    publicKey,
    delegates: voteList.map(delegate => `+${delegate}`).concat(
      unvoteList.map(delegate => `-${delegate}`),
    ),
    secondSecret,
  });

export const getVotes = (activePeer, address) =>
  requestToActivePeer(activePeer, 'accounts/delegates/', { address });

export const getVoters = (activePeer, publicKey) =>
  requestToActivePeer(activePeer, 'delegates/voters', { publicKey });

export const registerDelegate = (activePeer, username, secret, secondSecret = null) => {
  const data = { username, secret };
  if (secondSecret) {
    data.secondSecret = secondSecret;
  }
  return requestToActivePeer(activePeer, 'delegates', data);
};
