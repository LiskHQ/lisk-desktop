import React, { useState, useEffect, useCallback } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '@screens/router/routes';
import MultiStepProgressBar from '@shared/multiStepProgressBar';
import MultiStep from '@dpos/validator/components/RegisterDelegateMultiStep';
import useCreateAccounts from '@wallet/utilities/hooks/useCreateAccounts';
import ChooseAvatar from './chooseAvatar';
import BackupPassphrase from './backupPassphrase';
import ConfirmPassphrase from './confirmPassphrase';
import AccountCreated from './accountCreated';
import styles from './register.css';

const Register = ({ account, token, history }) => {
  const [selectedAccount, setSelectedAccount] = useState({});
  const { suggestionAccounts } = useCreateAccounts();

  useEffect(() => {
    if (account?.info?.[token.active].address) {
      history.push(routes.dashboard.path);
    }
  }, [account, history, token]);

  const handleSelectAvatar = useCallback((userSelectedAccount) => {
    setSelectedAccount(userSelectedAccount);
  }, []);

  return (
    <div className={`${grid.row} ${styles.register}`}>
      <MultiStep
        navStyles={{ multiStepWrapper: styles.wrapper }}
        progressBar={MultiStepProgressBar}
      >
        <ChooseAvatar
          accounts={suggestionAccounts}
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
  );
};

export default Register;
