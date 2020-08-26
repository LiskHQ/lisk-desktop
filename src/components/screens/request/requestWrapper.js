import React from 'react';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import { PrimaryButton } from '../../toolbox/buttons';
import styles from './request.css';
import Dialog from '../../toolbox/dialog/dialog';

const RequestWrapper = ({
  t,
  children,
  copyLabel,
  copyValue,
}) => {
  return (
    <Dialog hasClose>
      <div className={`${styles.container}`}>
        <section className={`${styles.formSection}`}>
          {children}
          <footer className={`${styles.sectionFooter}`}>
            <CopyToClipboard
              className="copy-button"
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
            {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
          </span>
          <div className={`${styles.qrCodeContainer}`}>
            <QRCode value={copyValue} size={235} />
          </div>
        </section>
      </div>
    </Dialog>
  );
};

export default RequestWrapper;
