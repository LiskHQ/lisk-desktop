import React from 'react';
import MultiStep from 'src/modules/common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import Form from '../RegisterDelegateForm';
import Summary from '../RegisterDelegateSummary';
import Status from '../RegisterDelegateStatus';
import styles from './registerDelegate.css';

const RegisterDelegate = ({ history, t }) => (
  <Dialog hasClose>
    <MultiStep className={styles.multiStep} prevPage={history.goBack} backButtonLabel={t('Back')}>
      <Form t={t} />
      <Summary t={t} />
      <TxSignatureCollector t={t} />
      <Status t={t} />
    </MultiStep>
  </Dialog>
);

export default RegisterDelegate;
