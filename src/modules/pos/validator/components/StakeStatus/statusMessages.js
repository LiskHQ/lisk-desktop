/* istanbul ignore file */
import React from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { statusMessages } from '@transaction/configuration/statusConfig';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './styles.css';

const unlockTime = 5;

const LiskAmountFormatted = ({ val, token }) => (
  <span className={styles.subHeadingBold}>
    <TokenAmount val={val} token={token} />
  </span>
);

const getSuccessMessage = (t, locked, unlockable, selfUnstake = { confirmed: 0 }, token) => {
  if (!locked && unlockable) {
    const regularUnlockable = BigInt(unlockable) - BigInt(selfUnstake.confirmed || 0);
    const selfUnstakeUnlockable = selfUnstake.confirmed;

    return (
      <>
        {regularUnlockable > BigInt(0) ? (
          <>
            <LiskAmountFormatted val={regularUnlockable.toString()} token={token} />{' '}
            <span>{t('will be available to unlock in {{unlockTime}}h.', { unlockTime })}</span>
          </>
        ) : null}
        {selfUnstakeUnlockable > 0 ? (
          <>
            <LiskAmountFormatted val={selfUnstakeUnlockable} token={token} />{' '}
            <span>{t('will be available to unlock in 1 month.')}</span>
          </>
        ) : null}
      </>
    );
  }
  if (locked && !unlockable) {
    return (
      <>
        <LiskAmountFormatted val={locked} token={token} />{' '}
        <span>{t('will be locked for staking.')}</span>
      </>
    );
  }
  if (locked && unlockable) {
    return (
      <>
        <span>{t('You have now locked')}</span> <LiskAmountFormatted val={locked} token={token} />{' '}
        <span>{t('for staking and may unlock')}</span>{' '}
        <LiskAmountFormatted val={unlockable} token={token} />{' '}
        <span>{t('in {{unlockTime}} hours.', { unlockTime })}</span>
      </>
    );
  }
  return '';
};

const stakeStatusMessages = (t, statusInfo, token) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Tokens are staked'),
    message: getSuccessMessage(
      t,
      statusInfo.locked,
      statusInfo.unlockable,
      statusInfo.selfUnstake,
      token
    ),
  },
});

export default stakeStatusMessages;
