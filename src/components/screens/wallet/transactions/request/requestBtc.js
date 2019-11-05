import React from 'react';

import RequestWrapper from './requestWrapper';

import styles from './request.css';

const RequestBtc = ({
  address, t,
}) => (
  <RequestWrapper copyLabel={t('Copy address')} copyValue={address} t={t}>
    <span className={`${styles.label}`}>
      {t('Copy the address or scan the QR code, to easily request BTC tokens from Lisk or Lisk Mobile users.')}
    </span>
    <label className={`${styles.fieldGroup}`}>
      <span className={`${styles.fieldLabel}`}>{t('BTC Address')}</span>
      <span className={`${styles.amountField} address`}>
        {address}
      </span>
    </label>
  </RequestWrapper>
);

export default RequestBtc;
