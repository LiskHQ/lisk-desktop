import { useEffect, useState } from 'react';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import { generatePassphrase } from '@views/utilities/passphrase';

const useCreateAccounts = () => {
  const [suggestionAccounts, setSuggestionAccounts] = useState([]);

  useEffect(() => {
    const passphrases = [...Array(5)].map(() => {
      const generatedPasspharse = generatePassphrase();
      return {
        passphrase: generatedPasspharse,
        address: extractAddressFromPassphrase(generatedPasspharse),
      };
    });

    setSuggestionAccounts(passphrases);
  }, []);

  return { setSuggestionAccounts, suggestionAccounts };
};

export default useCreateAccounts;
