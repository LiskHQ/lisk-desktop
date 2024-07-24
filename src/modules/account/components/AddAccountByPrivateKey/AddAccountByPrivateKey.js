/* eslint-disable max-statements */
import React, { useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from 'src/modules/common/components/MultiStep';
import SetPasswordSuccess from 'src/modules/auth/components/SetPasswordSuccess';
import PrivateKeyForm from '@auth/components/PrivateKeyForm';
import routes from 'src/routes/routes';
import { useCurrentAccount, useAccounts } from '@account/hooks';
import ImportPrivateKeyForm from '../ImportPrivateKeyForm';
import styles from './AddAccountByPrivateKey.css';

const AddAccountByPrivateKey = () => {
  const history = useHistory();
  const { search } = useLocation();
  const multiStepRef = useRef(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [currentAccount, setCurrentAccount] = useCurrentAccount();
  const { setAccount } = useAccounts();

  const queryParams = new URLSearchParams(search);
  const referrer = queryParams.get('referrer');

  const onAddAccount = (privateKeyData) => {
    setPrivateKey(privateKeyData);
    multiStepRef?.current?.next();
  };

  /* istanbul ignore next */
  const onSetPassword = (account) => {
    setCurrentAccount(account, null, false);
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
        <ImportPrivateKeyForm onAddAccount={onAddAccount} />
        <PrivateKeyForm
          privateKey={privateKey}
          onSubmit={onSetPassword}
        />
        <SetPasswordSuccess encryptedPhrase={currentAccount} onClose={onPasswordSetComplete} />
      </MultiStep>
    </div>
  );
};

export default AddAccountByPrivateKey;
