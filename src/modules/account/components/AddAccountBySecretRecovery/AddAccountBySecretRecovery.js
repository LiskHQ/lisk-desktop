/* eslint-disable max-statements */
import React, { useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import SetPasswordForm from 'src/modules/auth/components/SetPasswordForm/SetPasswordForm';
import MultiStep from 'src/modules/common/components/MultiStep';
import SetPasswordSuccess from 'src/modules/auth/components/SetPasswordSuccess';
import routes from 'src/routes/routes';
import { useCurrentAccount, useAccounts } from '@account/hooks';
import { defaultDerivationPath } from '@account/const';
import AddAccountForm from '../AddAccountForm';
import styles from './AddAccountBySecretRecovery.css';

const AddAccountBySecretRecovery = () => {
  const history = useHistory();
  const { search } = useLocation();
  const multiStepRef = useRef(null);
  const [recoveryPhrase, setRecoveryPhrase] = useState(null);
  const [customDerivationPath, setCustomDerivationPath] = useState(defaultDerivationPath);
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();

  const queryParams = new URLSearchParams(search);
  const referrer = queryParams.get('referrer');

  const onAddAccount = (recoveryPhraseData, derivationPath) => {
    setRecoveryPhrase(recoveryPhraseData);
    setCustomDerivationPath(derivationPath);
    multiStepRef?.current?.next();
  };

  /* istanbul ignore next */
  const onSetPassword = (account) => {
    setCurrentAccount(account);
    setAccount(account);
    multiStepRef?.current?.next();
  };

  /* istanbul ignore next */
  const onPasswordSetComplete = () => {
    history.push(referrer || routes.wallet.path);
  };

  return (
    <div className={`${styles.addAccount} ${grid.row}`}>
      <MultiStep navStyles={{ multiStepWrapper: styles.wrapper }} ref={multiStepRef}>
        <AddAccountForm onAddAccount={onAddAccount} />
        <SetPasswordForm
          recoveryPhrase={recoveryPhrase}
          customDerivationPath={customDerivationPath}
          onSubmit={onSetPassword}
        />
        <SetPasswordSuccess encryptedPhrase={currentAccount} onClose={onPasswordSetComplete} />
      </MultiStep>
    </div>
  );
};

export default AddAccountBySecretRecovery;
