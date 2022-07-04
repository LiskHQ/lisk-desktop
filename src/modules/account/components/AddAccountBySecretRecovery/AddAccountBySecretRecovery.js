/* eslint-disable max-lines */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import SetPasswordForm from 'src/modules/auth/components/SetPasswordForm/SetPasswordForm';
import MultiStep from 'src/modules/common/components/MultiStep';
import SetPasswordSuccess from 'src/modules/auth/components/SetPasswordSuccess';
import routes from 'src/routes/routes';
import { useCurrentAccount, useAccounts } from '@account/hooks';
import AddAccountForm from '../AddAccountForm';
import styles from './AddAccountBySecretRecovery.css';

const AddAccountBySecretRecovery = ({ history, login }) => {
  const multiStepRef = useRef(null);
  const [recoveryPhrase, setRecoveryPhrase] = useState(null);
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();
  const onAddAccount = (recoveryPhraseData) => {
    setRecoveryPhrase(recoveryPhraseData);
    multiStepRef.current.next();
  };

  const onSetPassword = (account) => {
    setCurrentAccount(account);
    setAccount(account);
    multiStepRef.current.next();
  };

  const onPasswordSetComplete = () => {
    login(recoveryPhrase); // Todo this login method is deprecated
    history.push(routes.dashboard.path);
  };

  return (
    <div className={`${styles.addAccount} ${grid.row}`}>
      <MultiStep
        navStyles={{ multiStepWrapper: styles.wrapper }}
        ref={multiStepRef}
      >
        <AddAccountForm onAddAccount={onAddAccount} />
        <SetPasswordForm recoveryPhrase={recoveryPhrase} onSubmit={onSetPassword} />
        <SetPasswordSuccess
          encryptedPhrase={currentAccount}
          onClose={onPasswordSetComplete}
        />
      </MultiStep>
    </div>
  );
};

export default withRouter(AddAccountBySecretRecovery);
