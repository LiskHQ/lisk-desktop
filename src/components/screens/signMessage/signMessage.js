import React from 'react';
import ConfirmMessage from './confirmMessage';
import MultiStep from '../../shared/multiStep';
import SignMessageInput from './signMessageInput';
import Dialog from '../../toolbox/dialog/dialog';
import styles from './signMessage.css';

const SignMessage = ({ account, t, history }) => (
  <Dialog hasClose className={styles.wrapper}>
    <MultiStep>
      <SignMessageInput t={t} history={history} />
      <ConfirmMessage t={t} account={account} />
    </MultiStep>
  </Dialog>
);

export default SignMessage;
