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
        <b>{t('Network Connection Issues')}</b>
        <p className={styles.message}>
          {t(
            'At the moment, the app is experiencing difficulty loading due to a lack of response from the network. Please attempt to retry.'
          )}
        </p>
        <TertiaryButton onClick={onRetry} className={styles.tryAgainButton}>
          {t('Try again')}
        </TertiaryButton>
        <p className={styles.message}>{t('Is the problem persisting?')}</p>
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
