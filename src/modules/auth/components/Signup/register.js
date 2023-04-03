import React, { useState, useEffect, useCallback } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import useCreateAccounts from '@auth/hooks/useCreateAccounts';
import MultiStepProgressBar from 'src/theme/ProgressBarMultiStep';
import MultiStep from 'src/modules/common/components/MultiStep';
import ChooseAvatar from '../ChooseAvatar/chooseAvatar';
import SavePassphrase from '../SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '../ConfirmPassphrase/confirmPassphrase';
import AccountCreated from '../SignupSuccessed/accountCreated';
import styles from './register.css';

const Register = ({ account, token, history }) => {
  const [selectedAccount, setSelectedAccount] = useState({});
  const { suggestionAccounts } = useCreateAccounts();

  useEffect(() => {
    if (account?.info?.[token.active].address) {
      history.push(routes.wallet.path);
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
        <SavePassphrase passphrase={selectedAccount.passphrase} />
        <ConfirmPassphrase account={selectedAccount} passphrase={selectedAccount.passphrase} />
        <AccountCreated account={selectedAccount} />
      </MultiStep>
    </div>
  );
};

export default Register;
