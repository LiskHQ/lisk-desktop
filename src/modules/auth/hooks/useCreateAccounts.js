import { useEffect, useState } from 'react';
import { extractAddressFromPassphrase } from '@wallet/utils/account';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';

const useCreateAccounts = (strength) => {
  const [suggestionAccounts, setSuggestionAccounts] = useState([]);

  useEffect(() => {
    const passphrases = [...Array(5)].map(() => {
      const generatedPassphrase = LiskPassphrase.Mnemonic.generateMnemonic(strength);
      return {
        passphrase: generatedPassphrase,
        address: extractAddressFromPassphrase(generatedPassphrase),
      };
    });

    setSuggestionAccounts(passphrases);
  }, []);

  return { setSuggestionAccounts, suggestionAccounts };
};

export default useCreateAccounts;
