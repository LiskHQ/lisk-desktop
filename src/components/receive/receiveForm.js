import React from 'react';

import AccountVisual from '../accountVisual';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import ReferenceInput from '../referenceInput';
import Converter from '../converter';
import styles from './receiveForm.css';

const RequestForm = ({
  address,
  amount,
  error,
  onAmountChange,
  onReferenceChange,
  reference,
  t,
}) => (
  <div className={styles.requestForm}>
    <div>
      <figure>
        <AccountVisual
          address={address}
          size={50}
        />
      </figure>
      <ToolBoxInput
        label={t('Recipient')}
        className={styles.disabledInput}
        value={address}
        disabled={true}
      />
    </div>

    <ReferenceInput
      className='reference'
      theme={styles}
      label={t('Reference (optional)')}
      reference={reference}
      handleChange={onReferenceChange}
    />

    <Converter
      label={t('Amount (LSK)')}
      className='amount'
      error={error}
      theme={styles}
      value={amount}
      onChange={onAmountChange}
      t={t}
      isRequesting
    />
  </div>
);

export default RequestForm;
