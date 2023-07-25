/* eslint-disable no-restricted-globals */
import { decryptAccount } from '../../../account/utils';

self.onmessage = (message) => {
  const { account, password } = message.data;

  decryptAccount(account.crypto, password)
    .then(self.postMessage)
    .catch(() => self.postMessage({ error: true }));
};
