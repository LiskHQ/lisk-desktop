/* eslint-disable no-restricted-globals */
import { encryptAccount } from '../../../account/utils';

self.onmessage = (message) => {
  const {
    recoveryPhrase,
    password,
    accountName,
    customDerivationPath,
    enableAccessToLegacyAccounts,
  } = message.data;

  encryptAccount({
    password,
    enableAccessToLegacyAccounts,
    name: accountName,
    recoveryPhrase: recoveryPhrase?.value,
    derivationPath: customDerivationPath,
  })
    .then(self.postMessage)
    .catch(() => self.postMessage({ error: true }));
};
