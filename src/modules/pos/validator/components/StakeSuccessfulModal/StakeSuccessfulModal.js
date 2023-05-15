import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import routes from 'src/routes/routes';
import BoxHeader from 'src/theme/box/header';
import { PrimaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import styles from './StakeSuccessfulModal.css';

function StakeSuccessfulModal({ history, statusMessage }) {
  const { t } = useTranslation();

  const handleBackToValidator = useCallback(() => {
    history.push(routes.validators.path);
  }, [history]);

  return (
    <Box className={styles.successContainer}>
      <BoxHeader>
        <h2>{t('Staking confirmed')}</h2>
      </BoxHeader>
      <BoxContent>
        <Illustration className={styles.illustration} name="stakingSuccess" />
        <p className={styles.messageLabel}>{statusMessage.message}</p>
      </BoxContent>
      <BoxFooter className={styles.footer}>
        <PrimaryButton className={styles.actionButton} onClick={handleBackToValidator}>
          {t('Back to validators')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
}

export default StakeSuccessfulModal;
