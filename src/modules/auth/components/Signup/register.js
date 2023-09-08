/* eslint-disable max-statements */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from 'src/routes/routes';
import useCreateAccounts from '@auth/hooks/useCreateAccounts';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import MultiStepProgressBar from 'src/theme/ProgressBarMultiStep';
import MultiStep from 'src/modules/common/components/MultiStep';
import { defaultDerivationPath } from '@account/const';
import ChooseAvatar from '../ChooseAvatar/chooseAvatar';
import SavePassphrase from '../SavePassphrase/SavePassphrase';
import ConfirmPassphrase from '../ConfirmPassphrase/confirmPassphrase';
import AccountCreated from '../AccountCreated';
import styles from './register.css';
import SetPasswordForm from '../SetPasswordForm';

const Register = ({ account, token }) => {
  const history = useHistory();
  const { search = '' } = useLocation();
  const multiStepRef = useRef(null);
  const queryParams = new URLSearchParams(search);
  const strength = queryParams.get('strength');

  const [isStepSetPasswordForm, setIsStepSetPasswordForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const { accounts } = useCreateAccounts(strength);
  const [, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();

  const onSetPassword = (encryptedAccount) => {
    setCurrentAccount(encryptedAccount, null, false);
    setAccount(encryptedAccount);
    multiStepRef.current?.next();
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
          accounts={accounts}
          selected={selectedAccount}
          handleSelectAvatar={handleSelectAvatar}
        />
        <SavePassphrase passphrase={selectedAccount.passphrase} />
        <ConfirmPassphrase account={selectedAccount} passphrase={selectedAccount.passphrase} />
        <SetPasswordForm
          recoveryPhrase={{ value: selectedAccount.passphrase }}
          customDerivationPath={defaultDerivationPath}
          onSubmit={onSetPassword}
          isLegacyAccount={false}
        />
        <AccountCreated account={selectedAccount} />
      </MultiStep>
    </div>
  );
};

export default Register;
