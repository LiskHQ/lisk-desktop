import { useEffect, useState } from 'react';
import { passphrase as LiskPassphrase, cryptography } from '@liskhq/lisk-client';
import { defaultDerivationPath } from '@account/const';

export const getPassphraseAndAddress = async (strength) => {
  const generatedPassphrase = LiskPassphrase.Mnemonic.generateMnemonic(strength);
  const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
    generatedPassphrase,
    defaultDerivationPath
  );
  const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);

  return {
    address: cryptography.address.getLisk32AddressFromPublicKey(publicKey).toString('hex'),
    passphrase: generatedPassphrase,
  };
};

const useCreateAccounts = (strength) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const accountsWithPassphrase = [...Array(5)].map(() => getPassphraseAndAddress(strength));
    Promise.all(accountsWithPassphrase)
      .then(setAccounts)
      .catch((e) => setError(e))
      .finally(() => setIsLoading(false));
  }, [strength]);

  return { accounts, isLoading, error };
};

export default useCreateAccounts;
