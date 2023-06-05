import { useEffect, useState } from 'react';
import { extractAddressFromPassphrase } from '@wallet/utils/account';
import { generatePassphrase } from 'src/modules/wallet/utils/passphrase';

const useCreateAccounts = (strength) => {
  const [suggestionAccounts, setSuggestionAccounts] = useState([]);

  useEffect(() => {
    const passphrases = [...Array(5)].map(() => {
      const generatedPassphrase = generatePassphrase(strength);
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
