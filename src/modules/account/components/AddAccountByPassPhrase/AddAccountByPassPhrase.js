/* eslint-disable max-lines */
import React, { useRef, useState } from 'react';
import { withRouter } from 'react-router';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import SetPasswordForm from 'src/modules/auth/components/SetPasswordForm/SetPasswordForm';
import MultiStep from 'src/modules/common/components/MultiStep';
import SetPasswordSuccess from '@auth/components/setPasswordSuccess';
import AddAccountForm from '../AddAccountForm';
import styles from './AddAccountByPassPhrase.css';

const AddAccountByPassPhrase = ({ history, login }) => {
  const multiStepRef = useRef(null);
  const [passphrase, setPassphrase] = useState(null);

  const onAddAccount = (passphraseData) => {
    multiStepRef.current.next();
    setPassphrase(passphraseData);
  };

  const onSetPassword = (formData) => {
    console.log('>>.', formData);
    // TODO: Implement encrypt user account with password here and save to localstorage;

    multiStepRef.current.next();
  };

  const onPasswordSetComplete = () => {
    login(passphrase);
    history.push('/');
  };

  return (
    <>
      <div className={`${styles.addAccount} ${grid.row}`}>
        <MultiStep
          navStyles={{ multiStepWrapper: styles.wrapper }}
          ref={multiStepRef}
        >
          <AddAccountForm onAddAccount={onAddAccount} />
          <SetPasswordForm onSubmit={onSetPassword} />
          <SetPasswordSuccess encryptedPhrase={null} onClose={onPasswordSetComplete} />
        </MultiStep>
      </div>
    </>
  );
};

export default withRouter(AddAccountByPassPhrase);
