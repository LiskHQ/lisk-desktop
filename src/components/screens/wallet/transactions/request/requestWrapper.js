import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import CopyToClipboard from '../../../../toolbox/copyToClipboard';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import styles from './request.css';

const RequestWrapper = ({
  t,
  children,
  copyLabel,
  copyValue,
}) => {
  const [expanded, setExpanded] = useState(false);
  const darkMode = useSelector(state => state.settings.DarkMode);
  console.log();

  return (
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
          <span className={`${styles.footerContent} ${expanded ? styles.hide : ''}`}>
            {t('Got the Lisk Mobile App?')}
            {' '}
            <span
              className={`${styles.footerActionable} toggle-qrcode`}
              onClick={() => setExpanded(!expanded)}
            >
              {t('Show the QR code')}
            </span>
          </span>
        </footer>
      </section>
      <section className={`${styles.qrSection} ${!expanded ? styles.hide : ''} qrcode-section`}>
        <span className={`${styles.label}`}>
          {t('Simply scan the QR code using the Lisk Mobile app or any other QR code reader')}
        </span>
        <div className={`${styles.qrCodeContainer}`}>
          <QRCode
            value={copyValue}
            size={235}
            fgColor={darkMode ? '#fff' : '#000'}
            bgColor={darkMode ? '#111112' : '#fff'}
          />
        </div>
        <footer className={`${styles.sectionFooter}`}>
          <span
            className={`${styles.footerContent} ${styles.footerActionable}`}
            onClick={() => setExpanded(!expanded)}
          >
            {t('Hide the QR code')}
          </span>
        </footer>
      </section>
    </div>
  );
};

export default RequestWrapper;
