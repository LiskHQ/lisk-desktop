import React from 'react';
import ConfirmMessage from './confirmMessage';
import MultiStep from '../../shared/multiStep';
import SignMessageInput from './signMessageInput';
import styles from './signMessage.css';

const SignMessage = ({ account, t, history }) => (
  <section className={styles.wrapper}>
    <MultiStep>
      <SignMessageInput t={t} history={history} />
      <ConfirmMessage t={t} account={account} />
    </MultiStep>
  </section>
);

export default SignMessage;
