import React from 'react';
import { withRouter } from 'react-router';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import { PrimaryButton } from '../../toolbox/buttons';
import styles from './request.css';
import Dialog from '../../toolbox/dialog/dialog';
import { selectSearchParamValue } from '../../../utils/searchParams';

const RequestWrapper = ({
  t,
  children,
  copyLabel,
  copyValue,
  title,
  className,
  history,
}) => {
  const isHost = selectSearchParamValue(history.location.search, 'host') === 'true';

  return (
    <Dialog hasClose className={styles.dialogWrapper}>
      <div className={`${styles.container}`}>
        {isHost && (
          <>
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
          </>
        )}
        <section className={`${styles.qrSection} qrcode-section`}>
          <span className={`${styles.label}`}>
            {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
          </span>
          <div className={`${styles.qrCodeContainer}`}>
            <QRCode value={copyValue} size={176} />
          </div>
        </section>
      </div>
    </Dialog>
  );
};

export default withRouter(RequestWrapper);
