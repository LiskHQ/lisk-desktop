import React from 'react';
import { AutoResizeTextarea } from '../../../../toolbox/inputs';
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
