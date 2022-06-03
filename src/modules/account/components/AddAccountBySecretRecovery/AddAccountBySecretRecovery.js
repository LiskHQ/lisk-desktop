/* eslint-disable max-lines */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import SetPasswordForm from 'src/modules/auth/components/SetPasswordForm/SetPasswordForm';
import MultiStep from 'src/modules/common/components/MultiStep';
import SetPasswordSuccess from 'src/modules/auth/components/setPasswordSuccess';
import routes from '@views/screens/router/routes';
import { useCurrentAccount } from '@account/hooks';
import AddAccountForm from '../AddAccountForm';
import styles from './AddAccountBySecretRecovery.css';

const AddAccountBySecretRecovery = ({ history, login }) => {
  const multiStepRef = useRef(null);
  const [passphrase, setPassphrase] = useState(null);
  const [accountSchema, setAccountSchema] = useState(null);

  const onAddAccount = (passphraseData) => {
    setPassphrase(passphraseData);
    multiStepRef.current.next();
  };

  const onSetPassword = (account) => {
    useCurrentAccount(account);
    setAccountSchema(account);
    multiStepRef.current.next();
  };

  const onPasswordSetComplete = () => {
    login(passphrase); // Todo this login method is depricated
    history.push(routes.dashboard.path);
  };

  return (
    <div className={`${styles.addAccount} ${grid.row}`}>
      <MultiStep
        navStyles={{ multiStepWrapper: styles.wrapper }}
        ref={multiStepRef}
      >
        <AddAccountForm onAddAccount={onAddAccount} />
        <SetPasswordForm recoveryPhrase={passphrase} onSubmit={onSetPassword} />
        <SetPasswordSuccess
          encryptedPhrase={accountSchema}
          onClose={onPasswordSetComplete}
        />
      </MultiStep>
    </div>
  );
};

export default withRouter(AddAccountBySecretRecovery);
