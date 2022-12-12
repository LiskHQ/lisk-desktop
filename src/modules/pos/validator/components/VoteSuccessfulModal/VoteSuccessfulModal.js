import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import routes from 'src/routes/routes';
import BoxHeader from 'src/theme/box/header';
import { PrimaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import Illustration from 'src/modules/common/components/illustration';
import styles from './VoteSuccessfulModal.css';

function VoteSuccessfulModal({ history, statusMessage }) {
  const { t } = useTranslation();

  const handleBackToDelegate = useCallback(() => {
    history.push(routes.validators.path);
  }, [history]);

  return (
    <Box className={styles.successContainer}>
      <BoxHeader>{t('Voting confirmation')}</BoxHeader>
      <BoxContent>
        <Illustration className={styles.illustartion} name="votingSuccess" />
        <h4>{t('Vote(s) has been submitted')}</h4>
        <p>{statusMessage.message}</p>
      </BoxContent>
      <BoxFooter>
        <PrimaryButton onClick={handleBackToDelegate}>{t('Back to validators')}</PrimaryButton>
      </BoxFooter>
    </Box>
  );
}

export default VoteSuccessfulModal;
