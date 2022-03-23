import React from 'react';
import { AutoResizeTextarea } from '@basics/inputs';
import RequestWrapper from './requestWrapper';
import styles from './request.css';

const RequestBtc = ({
  address, t,
}) => (
  <RequestWrapper copyLabel={t('Copy address')} copyValue={address} t={t} title={t('Request BTC')} className={styles.BTCWrapper}>
    <span className={`${styles.label}`}>
      {t('Request BTC from another Lisk user. Copy the BTC address or scan the QR code to share your request.')}
    </span>
    <label className={`${styles.fieldGroup}`}>
      <span className={`${styles.fieldLabel}`}>{t('BTC address')}</span>
      <AutoResizeTextarea
        name="shareLink"
        value={address}
        className={`${styles.textarea} ${styles.sharingLink} request-link`}
        readOnly
      />
    </label>
  </RequestWrapper>
);

export default RequestBtc;
