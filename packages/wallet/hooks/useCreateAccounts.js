import React, { useEffect } from 'react';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import { generatePassphrase } from '@views/utilities/passphrase';

const useCreateAccounts = () => {
  const [accounts, setAccounts] = React.useState([]);

  useEffect(() => {
    const passphrases = [...Array(5)].map(generatePassphrase);
    setAccounts(passphrases.map(pass => ({
      address: extractAddressFromPassphrase(pass),
      passphrase: pass,
    })));
  }, []);

  return { setAccounts, accounts };
};

export default useCreateAccounts;
