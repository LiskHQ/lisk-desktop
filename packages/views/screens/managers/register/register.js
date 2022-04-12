import React, { useState, useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { generatePassphrase } from '@common/utilities/passphrase';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import routes from '@screens/router/routes';
import MultiStepProgressBar from '@shared/multiStepProgressBar';
import MultiStep from '@shared/registerMultiStep';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import styles from './register.css';

const Register = ({ account, token, history }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({});

  useEffect(() => {
    const passphrases = [...Array(5)].map(generatePassphrase);
    const acc = passphrases.map((pass) => ({
      address: extractAddressFromPassphrase(pass),
      passphrase: pass,
    }));
    setAccounts(acc);
  }, []);

  useEffect(() => {
    if (account?.info?.[token.active].address) {
      history.push(routes.dashboard.path);
    }
  }, [account, history, token]);

  const handleSelectAvatar = (userSelectedAccount) => {
    setSelectedAccount(userSelectedAccount);
  };

  return (
    <>
      <div className={`${grid.row} ${styles.register}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          progressBar={MultiStepProgressBar}
        >
          <ChooseAvatar
            accounts={accounts}
            selected={selectedAccount}
            handleSelectAvatar={handleSelectAvatar}
          />
          <BackupPassphrase account={selectedAccount} />
          <ConfirmPassphrase
            account={selectedAccount}
            passphrase={selectedAccount.passphrase}
          />
          <AccountCreated account={selectedAccount} />
        </MultiStep>
      </div>
    </>
  );
};

export default Register;
