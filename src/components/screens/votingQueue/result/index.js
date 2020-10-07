import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '../../../../utils/searchParams';
import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton } from '../../../toolbox/buttons';
import Illustration from '../../../toolbox/illustration';
import ToggleIcon from '../toggleIcon';

import styles from './styles.css';

const unlockTime = 5;

const LiskAmountFormatted = ({ val }) =>
  <span className={styles.subHeadingBold}><LiskAmount val={val} /></span>;

const Result = ({
  t, history, locked, unlockable,
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
            {unlockable && !locked
              ? (
                <>
                  <LiskAmountFormatted val={unlockable} />
                  <span>{t(`will be available to unlock in ${unlockTime}h.`)}</span>
                </>
              )
              : null}
            {locked && !unlockable
              ? (
                <>
                  <LiskAmountFormatted val={locked} />
                  <span>{t('LSK will be locked for voting.')}</span>
                </>
              )
              : null}
            {locked && unlockable
              ? (
                <>
                  <span>{t('You have now locked')}</span>
                  <LiskAmountFormatted val={locked} />
                  <span>{t('LSK for voting and may unlock')}</span>
                  <LiskAmountFormatted val={unlockable} />
                  <span>{t('LSK in {{unlockTime}} hours.', { unlockTime })}</span>
                </>
              )
              : null}
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

export default withRouter(withTranslation()(Result));
