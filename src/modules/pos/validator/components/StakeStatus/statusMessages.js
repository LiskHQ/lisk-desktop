/* istanbul ignore file */
import React, { Fragment } from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { statusMessages } from '@transaction/configuration/statusConfig';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './styles.css';

const unlockTime = 5;

const LiskAmountFormatted = ({ val }) => (
  <span className={styles.subHeadingBold}>
    <TokenAmount isLsk val={val} />
  </span>
);

const getSuccessMessage = (t, locked, unlockable, selfUnstake = { confirmed: 0 }) => {
  if (!locked && unlockable) {
    const regularUnlockable = unlockable - Number(selfUnstake.confirmed || 0);
    const selfUnstakeUnlockable = selfUnstake.confirmed;

    return (
      <>
        {regularUnlockable > 0 ? (
          <>
            <LiskAmountFormatted val={regularUnlockable} />{' '}
            <span>{t('will be available to unlock in {{unlockTime}}h.', { unlockTime })}</span>
          </>
        ) : null}
        {selfUnstakeUnlockable > 0 ? (
          <>
            <LiskAmountFormatted val={selfUnstakeUnlockable} />{' '}
            <span>{t('will be available to unlock in 1 month.')}</span>
          </>
        ) : null}
      </>
    );
  }
  if (locked && !unlockable) {
    return (
      <>
        <LiskAmountFormatted val={locked} /> <span>{t('will be locked for staking.')}</span>
      </>
    );
  }
  if (locked && unlockable) {
    return (
      <>
        <span>{t('You have now locked')}</span> <LiskAmountFormatted val={locked} />{' '}
        <span>{t('for staking and may unlock')}</span> <LiskAmountFormatted val={unlockable} />{' '}
        <span>{t('in {{unlockTime}} hours.', { unlockTime })}</span>
      </>
    );
  }
  return '';
};

const stakeStatusMessages = (t, statusInfo) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Tokens are staked'),
    message: getSuccessMessage(t, statusInfo.locked, statusInfo.unlockable, statusInfo.selfUnstake),
  },
});

export default stakeStatusMessages;
