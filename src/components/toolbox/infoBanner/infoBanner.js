import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Icon from '@toolbox/icon';
import styles from './infoBanner.css';
import Illustration from '../illustration';

const InfoBanner = ({
  name,
  infoLabel,
  infoMessage,
  infoDescription,
  infoLink,
  className,
  t,
}) => {
  const [visibility, setVisibility] = useState(
    !localStorage.getItem(name) ? 'visible' : 'hidden',
  );
  const isLoggedIn = useSelector(state => (state.account && state.account.passphrase));

  const handleClose = () => {
    localStorage.setItem(name, true);
    setVisibility('hidden');
  };

  if (visibility === 'hidden' || !isLoggedIn) return null;
  return (
    <div className={`${styles.infoBanner} ${className}`}>
      <span
        className={`closeBanner ${styles.closeBtn}`}
        onClick={handleClose}
      />
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
      <div className={styles.illustrations}>
        <Illustration
          className={`${styles.active}`}
          name="illustrationBtcSupport"
        />
      </div>
    </div>
  );
};

export default withTranslation()(InfoBanner);
