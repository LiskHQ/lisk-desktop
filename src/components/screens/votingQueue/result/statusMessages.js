import React from 'react';

import LiskAmount from '@shared/liskAmount';
import styles from './styles.css';

const unlockTime = 5;

const LiskAmountFormatted = ({ val }) => (
  <span className={styles.subHeadingBold}>
    <LiskAmount val={val} token="LSK" />
  </span>
);

const getSuccessMessage = (t, locked, unlockable, selfUnvote = { confirmed: 0 }) => {
  if (!locked && unlockable) {
    const regularUnlockable = unlockable - Number(selfUnvote.confirmed);
    const selfUnvoteUnlockable = selfUnvote.confirmed;

    return (
      <>
        {regularUnlockable > 0
          ? (
            <>
              <LiskAmountFormatted val={regularUnlockable} />
              {' '}
              <span>{t('will be available to unlock in {{unlockTime}}h.', { unlockTime })}</span>
            </>
          ) : null}
        {selfUnvoteUnlockable > 0
          ? (
            <>
              <LiskAmountFormatted val={selfUnvoteUnlockable} />
              {' '}
              <span>{t('will be available to unlock in 1 month.')}</span>
            </>
          ) : null}
      </>
    );
  } if (locked && !unlockable) {
    return (
      <>
        <LiskAmountFormatted val={locked} />
        {' '}
        <span>{t('will be locked for voting.')}</span>
      </>
    );
  } if (locked && unlockable) {
    return (
      <>
        <span>{t('You have now locked')}</span>
        <LiskAmountFormatted val={locked} />
        <span>{t('for voting and may unlock')}</span>
        <LiskAmountFormatted val={unlockable} />
        <span>{t('in {{unlockTime}} hours.', { unlockTime })}</span>
      </>
    );
  }
  return '';
};

/* istanbul ignore file */
const statusMessages = (t, statusInfo) => ({
  pending: {
    title: t('Submitting your votes'),
    message: t('Your votes are being submitted to the blockchain.'),
  },
  success: {
    title: t('Votes are submitted'),
    message: getSuccessMessage(t, statusInfo.locked, statusInfo.unlockable, statusInfo.selfUnvote),
  },
  error: {
    title: t('Vote submission failed'),
    message: t('Oops, it looks like something went wrong. Please try again.'),
  },
  hw: {
    title: t('Vote aborted on device'),
    message: t('You have cancelled the vote on your hardware wallet.'),
  },
});

export default statusMessages;
