import React from 'react';
import QRCode from 'qrcode.react';
import CopyToClipboard from '@basics/copyToClipboard';
import { PrimaryButton } from '@basics/buttons';
import Dialog from '@basics/dialog/dialog';
import styles from './request.css';

const RequestWrapper = ({
  t,
  children,
  copyLabel,
  copyValue,
  title,
  className,
}) => (
  <Dialog hasClose className={styles.dialogWrapper}>
    <div className={`${styles.container}`}>
      <h5>{title}</h5>
      <section className={`${styles.formSection} ${className}`}>
        {children}
        <footer className={`${styles.sectionFooter}`}>
          <CopyToClipboard
            className={`${styles.copyButton} copy-button`}
            Container={PrimaryButton}
            containerProps={{ size: 's' }}
            value={copyValue}
            text={copyLabel}
            copyClassName={styles.copyIcon}
          />
        </footer>
      </section>
      <section className={`${styles.qrSection} qrcode-section`}>
        <span className={`${styles.label}`}>
          {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader.')}
        </span>
        <div className={`${styles.qrCodeContainer}`}>
          <QRCode value={copyValue} size={176} />
        </div>
      </section>
    </div>
  </Dialog>
);

export default RequestWrapper;
