import React from 'react';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { PrimaryButton } from '@theme/buttons';
import Dialog from '@theme/dialog/dialog';
import classNames from 'classnames';
import styles from './request.css';

const RequestWrapper = ({ t, children, copyLabel, copyValue, title, className, disabled }) => (
  <Dialog hasClose className={styles.dialogWrapper}>
    <div className={`${styles.container}`}>
      <h5>{title}</h5>
      <section className={`${styles.formSection} ${className}`}>
        {children}
        <footer className={`${styles.sectionFooter}`}>
          <CopyToClipboard
            className={`${styles.copyButton} copy-button`}
            Container={PrimaryButton}
            containerProps={{ size: 'l', disabled: true }}
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
        <div className={classNames(styles.qrCodeContainer, { [styles.disabled]: disabled })}>
          <QRCode value={copyValue} size={176} />
        </div>
      </section>
    </div>
  </Dialog>
);

export default RequestWrapper;
