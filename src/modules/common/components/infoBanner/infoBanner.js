import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Icon from '@theme/Icon';
import styles from './infoBanner.css';

const InfoBanner = ({
  name,
  infoLabel,
  infoMessage,
  infoDescription,
  infoLink,
  className,
  show,
  t,
}) => {
  const [visibility, setVisibility] = useState(!localStorage.getItem(name) && show);
  const isLoggedIn = useSelector((state) => state.wallet && state.wallet.passphrase);

  const handleClose = () => {
    localStorage.setItem(name, true);
    setVisibility(false);
  };

  useEffect(() => {
    if (show && !localStorage.getItem(name)) {
      setVisibility(true);
    }
  }, [show]);

  if (!visibility || !isLoggedIn) return null;

  return (
    <div className={`${styles.infoBanner} ${className}`}>
      <span className={`closeBanner ${styles.closeBtn}`} onClick={handleClose} />
      <div className={styles.content}>
        <div className={styles.label}>
          <span>{infoLabel}</span>
        </div>
        <div className={`${styles.slides} slides`}>
          <section className={`${className || ''} ${styles.active}`}>
            <h1 className={styles.infoMessage}>{infoMessage}</h1>
            <p>{infoDescription}</p>
            <p
              className={`${styles.infoLink} link`}
              onClick={() => {
                window.open(`${infoLink}`);
              }}
            >
              {t('Read more ')}
              <Icon name="whiteLinkIcon" />
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(InfoBanner);
