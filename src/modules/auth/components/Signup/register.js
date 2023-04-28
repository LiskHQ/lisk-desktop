/* eslint-disable max-statements */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import useCreateAccounts from '@auth/hooks/useCreateAccounts';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import MultiStepProgressBar from 'src/theme/ProgressBarMultiStep';
import MultiStep from 'src/modules/common/components/MultiStep';
import ChooseAvatar from '../ChooseAvatar/chooseAvatar';
import SavePassphrase from '../SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '../ConfirmPassphrase/confirmPassphrase';
import AccountCreated from '../AccountCreated';
import styles from './register.css';
import SetPasswordForm from '../SetPasswordForm';

const Register = ({ account, token, history }) => {
  const multiStepRef = useRef(null);
  const [isStepSetPasswordForm, setIsStepSetPasswordForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const { suggestionAccounts } = useCreateAccounts();
  const [, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();

  const onSetPassword = (encryptedAccount) => {
    setCurrentAccount(encryptedAccount);
    setAccount(encryptedAccount);
    multiStepRef.current.next();
  };

  useEffect(() => {
    if (account?.info?.[token.active].address) {
      history.push(routes.wallet.path);
    }
  }, [account, history, token]);

  const onMultiStepChange = useCallback((current) => {
    setIsStepSetPasswordForm(current === 3);
  }, []);

  const handleSelectAvatar = useCallback((userSelectedAccount) => {
    setSelectedAccount(userSelectedAccount);
  }, []);

  return (
    <div className={`${grid.row} ${styles.register}`}>
      <MultiStep
        navStyles={{
          multiStepWrapper: `${styles.wrapper} ${
            isStepSetPasswordForm ? styles.setPasswordFormWrapper : ''
          }`,
        }}
        progressBar={MultiStepProgressBar}
        ref={multiStepRef}
        onChange={onMultiStepChange}
      >
        <ChooseAvatar
          accounts={suggestionAccounts}
          selected={selectedAccount}
          handleSelectAvatar={handleSelectAvatar}
        />
        <SavePassphrase passphrase={selectedAccount.passphrase} />
        <ConfirmPassphrase account={selectedAccount} passphrase={selectedAccount.passphrase} />
        <SetPasswordForm
          recoveryPhrase={{ value: selectedAccount.passphrase }}
          onSubmit={onSetPassword}
        />
        <AccountCreated account={selectedAccount} />
      </MultiStep>
    </div>
  );
};

export default Register;
