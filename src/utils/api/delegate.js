import { requestToActivePeer } from './peers';

const findDelegateInList = (username, list) => {
  let existed = false;
  list.forEach((item) => {
    if (item.username === username) {
      existed = true;
    }
  });
  return existed;
};

export const listAccountDelegates = (activePeer, address) =>
  requestToActivePeer(activePeer, 'accounts/delegates', { address });


export const listDelegates = (activePeer, options) =>
  requestToActivePeer(activePeer, `delegates/${options.q ? 'search' : ''}`, options);

export const getDelegate = (activePeer, publicKey) =>
  requestToActivePeer(activePeer, 'delegates/get', { publicKey });

export const vote = (activePeer, secret, publicKey, voteList, unvoteList, secondSecret = null) =>
  requestToActivePeer(activePeer, 'accounts/delegates', {
    secret,
    publicKey,
    delegates: voteList.map(delegate => `+${delegate.publicKey}`).concat(
      unvoteList.map(delegate => `-${delegate.publicKey}`),
    ),
    secondSecret,
  });

export const voteAutocomplete = (activePeer, username, votedDict) => {
  const options = { q: username };

  return new Promise((resolve, reject) =>
    listDelegates(activePeer, options)
    .then((response) => {
      resolve(response.delegates.filter(delegate =>
        !findDelegateInList(delegate.username, votedDict),
      ));
    })
    .catch(reject),
  );
};

export const unvoteAutocomplete = (username, votedList) =>
  new Promise((resolve) => {
    resolve(votedList.filter(delegate => delegate.username.indexOf(username) !== -1));
  });

export const registerDelegate = (activePeer, username, secret, secondSecret = null) => {
  const data = { username, secret };
  if (secondSecret) {
    data.secondSecret = secondSecret;
  }
  return requestToActivePeer(activePeer, 'delegates', data);
};
