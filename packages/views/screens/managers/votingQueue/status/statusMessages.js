/* istanbul ignore file */
import React from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { statusMessages } from '@transaction/detail/info/transactionResult/statusConfig';
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
    const regularUnlockable = unlockable - Number(selfUnvote.confirmed || 0);
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
        {' '}
        <LiskAmountFormatted val={locked} />
        {' '}
        <span>{t('for voting and may unlock')}</span>
        {' '}
        <LiskAmountFormatted val={unlockable} />
        {' '}
        <span>{t('in {{unlockTime}} hours.', { unlockTime })}</span>
      </>
    );
  }
  return '';
};

const voteStatusMessages = (t, statusInfo) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Votes are submitted'),
    message: getSuccessMessage(t, statusInfo.locked, statusInfo.unlockable, statusInfo.selfUnvote),
  },
});

export default voteStatusMessages;
