import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useCurrentAccount } from 'src/modules/account/hooks';
import Icon from '@theme/Icon';
import Illustration from '@common/components/illustration';
import styles from './infoBanner.css';

// eslint-disable-next-line complexity
const InfoBanner = ({
  name,
  infoLabel,
  infoMessage,
  infoDescription,
  infoLink,
  infoLinkText,
  illustrationName,
  className,
  handleSliderBannerClose,
  show,
}) => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState(!localStorage.getItem(name) && show);
  const [currentAccount] = useCurrentAccount();
  const isLoggedIn = !!currentAccount;
  const isLocalLink = infoLink?.startsWith('/');

  const handleClose = () => {
    localStorage.setItem(name, true);
    setVisibility(false);
    handleSliderBannerClose?.();
  };

  useEffect(() => {
    if (show && !localStorage.getItem(name)) {
      setVisibility(true);
    }
  }, [show]);

  if (!visibility || !isLoggedIn) return null;

  return (
    <div className={`${styles.infoBanner} ${className || ''} bannerWrapper`}>
      <span
        className={`closeBanner ${styles.closeBtn}`}
        data-testid="close-banner"
        onClick={handleClose}
      />
      <div className={styles.content}>
        <div className={styles.label}>
          <span className={classNames({ [styles[infoLabel.toLowerCase()]]: true })}>
            {infoLabel}
          </span>
        </div>
        <div className={`${styles.slides} slides`}>
          <section className={`${className || ''} ${styles.active}`}>
            <h1 className={styles.infoMessage}>{infoMessage}</h1>
            <p>
              {infoDescription}{' '}
              {infoLink && isLocalLink && (
                <Link className={`${styles.infoLink} link`} to={infoLink}>
                  {infoLinkText ?? t('Read more ')}
                </Link>
              )}
              {infoLink && !isLocalLink && (
                <span
                  className={`${styles.infoLink} link`}
                  onClick={() => {
                    window.open(`${infoLink}`);
                  }}
                >
                  {infoLinkText ?? t('Read more ')}
                  <Icon name="whiteLinkIcon" />
                </span>
              )}
            </p>
          </section>
        </div>
      </div>
      <div className={styles.bannerImg}>
        <Illustration name={illustrationName} />
      </div>
    </div>
  );
};

export default InfoBanner;
