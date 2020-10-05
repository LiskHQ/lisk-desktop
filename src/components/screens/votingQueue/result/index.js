import React from 'react';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import Illustration from '../../../toolbox/illustration';
import ToggleIcon from '../toggleIcon';

import styles from './styles.css';

const Result = ({
  t = s => s, totalVoteAmount = 2100, unlockTime = '5h 30min', history,
}) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <section>
      <Box className={styles.container}>
        <header className={styles.header}>
          <ToggleIcon />
          <span className={styles.title}>{t('Voting Confirmation')}</span>
        </header>
        <BoxContent className={styles.content}>
          <Illustration name="votingSuccess" />
          <span className={styles.submissionHeading}>
            {t('Votes have been submitted')}
          </span>
          <span className={styles.submissionSubHeading}>
            {`${totalVoteAmount} ${t('LSK will be available to unlock in ~')}${unlockTime}.`}
          </span>
        </BoxContent>
        <BoxFooter direction="horizontal" className={styles.footer}>
          <PrimaryButton size="l" onClick={closeModal}>
            {t('Back to wallet')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default withRouter(Result);
