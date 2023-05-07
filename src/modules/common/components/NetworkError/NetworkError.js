import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import { TertiaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import styles from './NetworkError.css';

const NetworkError = ({ onRetry, errorMessage }) => {
  const { t } = useTranslation();

  const mailReference = useMemo(() => {
    const recipient = 'desktopdev@lisk.com';
    const subject = `User Reported Error - Lisk - ${VERSION}`; // eslint-disable-line no-undef
    return `mailto:${recipient}?&subject=${subject}&body=${errorMessage}`;
  }, []);

  return (
    <Box className={styles.container}>
      <section>
        <Illustration name="networkErrorIllustration" className={styles.illustration} />
        <b>Something went wrong</b>
        <p className={styles.message}>
          We&apos;re sorry, but the app is having trouble loading right now. Please try again.
        </p>
        <TertiaryButton onClick={onRetry} className={styles.tryAgainButton}>
          Try again
        </TertiaryButton>
        <p className={styles.message}>Is the problem persisting?</p>
        <a target="_blank" href={mailReference} rel="noopener noreferrer">
          <TertiaryButton className={styles.actionButton}>
            {t('Report the error via email')}
          </TertiaryButton>
        </a>
      </section>
    </Box>
  );
};

export default NetworkError;
