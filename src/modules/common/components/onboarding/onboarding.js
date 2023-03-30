import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {useTranslation, withTranslation} from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '@theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import styles from './onboarding.css';

const getOnboardingSlides = (t) => [
  {
    title: t('Ready to go!'),
    content: t(
      'The ultimate gateway to the ecosystem. Lisk’s new design lets you easily manage your LSK (and much, much more).'
    ),
    illustration: 'hubReadyToGo',
  },
  {
    title: t('Stay Informed'),
    content: t(
      'Keep up-to-date with announcements from the Lisk Foundation. Check what network validators have been up to with dedicated profile pages.'
    ),
    illustration: 'builtAroundCommunity',
  },
  {
    title: t('Effortlessly send and receive tokens'),
    content: t('Personalize each transaction with a custom message.'),
    illustration: 'sendLSKTokens',
  },
  {
    title: t('Get Involved'),
    content: t(
      'Community is key. Stake for validators, or register as one yourself. Feel like a feature is missing? Request it directly from the Lisk.'
    ),
    illustration: 'timeToContribute',
  },
];

const Onboarding = ({
  onDiscard,
  name = 'dashboardOnboarding',
  finalCallback,
  actionButtonLabel,
  className,
  t,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibility, setVisibility] = useState(!localStorage.getItem(name) ? 'visible' : 'hidden');
  const isLoggedIn = useSelector((state) => state.wallet && state.wallet.passphrase);
  const { t } = useTranslation();
  const slides = getOnboardingSlides(t)

  const handleClose = () => {
    localStorage.setItem(name, true);
    setVisibility('hidden');
  };

  const handleDiscard = () => {
    handleClose();
    if (typeof onDiscard === 'function') {
      onDiscard();
    }
  };

  const handleFinalCallback = () => {
    if (typeof finalCallback === 'function') finalCallback();
    handleClose();
  };

  const setCurrent = (index) => {
    const nextSlide = index >= 0 && index < slides.length ? index : currentSlide;
    setCurrentSlide(nextSlide);
  };

  const handleButtonClick = ({ target }) => {
    if (target.name === 'next') return setCurrent(currentSlide + 1);
    return setCurrent(currentSlide - 1);
  };

  if (visibility === 'hidden' || !slides.length || !isLoggedIn) return null;
  return (
    <div className={`${styles.onboarding} ${className}`}>
      <span className={`closeOnboarding ${styles.closeBtn}`} onClick={handleDiscard} />
      <div className={styles.illustrations}>
        {slides.map(({ illustration }, i) => (
          <Illustration
            className={`${i === currentSlide ? styles.active : ''}`}
            key={`illustration-${i}`}
            name={illustration}
          />
        ))}
      </div>

      <div className={styles.content}>
        {slides.length > 1 ? (
          <span className={styles.bullets}>
            {slides.map((_, i) => (
              <span
                key={`bullet-${i}`}
                data-index={i}
                className={i === currentSlide ? styles.active : ''}
              />
            ))}
          </span>
        ) : null}
        <div className={`${styles.slides} slides`}>
          {slides.map((slide, index) => (
            <section
              key={`slides-${index}`}
              className={`${slide.className || ''} ${index === currentSlide ? styles.active : ''}`}
            >
              <h1 className={styles.title}>{slide.title}</h1>
              <p>{slide.content}</p>
            </section>
          ))}
        </div>
        <div className={styles.buttonsHolder}>
          {currentSlide !== 0 ? (
            <SecondaryButton className="light" size="m" name="prev" onClick={handleButtonClick}>
              {t('Previous')}
            </SecondaryButton>
          ) : null}
          {currentSlide !== slides.length - 1 && actionButtonLabel !== '' ? (
            <PrimaryButton size="m" name="next" onClick={handleButtonClick}>
              {t('Next')}
            </PrimaryButton>
          ) : (
            <PrimaryButton size="m" onClick={handleFinalCallback}>
              {actionButtonLabel}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

Onboarding.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
      ]).isRequired,
      illustration: PropTypes.string.isRequired,
    })
  ),
  actionButtonLabel: PropTypes.string,
  finalCallback: PropTypes.func,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

Onboarding.defaultProps = {
  slides: [],
  className: '',
  actionButtonLabel: '',
  finalCallback: null,
};

export default withTranslation()(Onboarding);
