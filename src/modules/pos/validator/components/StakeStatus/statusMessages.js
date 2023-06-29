/* eslint-disable complexity */
/* istanbul ignore file */
import React from 'react';
import { txStatusTypes } from '@transaction/configuration/txStatus';
import { statusMessages } from '@transaction/configuration/statusConfig';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './styles.css';

const LiskAmountFormatted = ({ val, token, message }) => (
  <span className={styles.subHeadingBold}>
    <TokenAmount val={val} token={token} /> {message}
  </span>
);

const RewardAmountFormatted = ({ val, token, message }) => (
  <span className={styles.rewardAmount}>
    <TokenAmount val={val} token={token} /> {message}
  </span>
);

const getSuccessMessage = (
  t,
  locked,
  unlockable,
  selfUnstake = { confirmed: 0 },
  token,
  { rewards }
) => {
  if (!locked && unlockable) {
    const regularUnlockable = BigInt(unlockable) - BigInt(selfUnstake.confirmed || 0);
    const selfUnstakeUnlockable = selfUnstake.confirmed;

    return (
      <>
        {regularUnlockable > BigInt(0) ? (
          <>
            <div className={styles.stakeSection}>
              <LiskAmountFormatted
                val={regularUnlockable.toString()}
                token={token}
                message={t('will be available to unlock when the locking period ends.')}
              />
            </div>
            {rewards.total && (
              <div className={styles.rewardsSection}>
                <RewardAmountFormatted
                  val={rewards.total}
                  token={token}
                  message={t('will be credited to your account due to changes in stakes.')}
                />
              </div>
            )}
          </>
        ) : null}
        {selfUnstakeUnlockable > 0 ? (
          <>
            <div className={styles.stakeSection}>
              <LiskAmountFormatted
                val={selfUnstakeUnlockable}
                token={token}
                message={t('will be available to unlock when the locking period ends.')}
              />
            </div>
            {rewards.total && (
              <div className={styles.rewardsSection}>
                <RewardAmountFormatted
                  val={rewards.total}
                  token={token}
                  message={t('will be credited to your account due to changes in stakes.')}
                />
              </div>
            )}
          </>
        ) : null}
      </>
    );
  }
  if (locked && !unlockable) {
    return (
      <>
        <div className={styles.stakeSection}>
          <LiskAmountFormatted
            val={locked}
            token={token}
            message={t('will be locked for staking.')}
          />
        </div>
        {rewards.total && (
          <div className={styles.rewardsSection}>
            <RewardAmountFormatted
              val={rewards.total}
              token={token}
              message={t('will be credited to your account due to changes in stakes.')}
            />
          </div>
        )}
      </>
    );
  }
  if (locked && unlockable) {
    return (
      <>
        <span>{t('You have now locked')}</span>{' '}
        <LiskAmountFormatted val={locked} token={token} message={t('for staking and may unlock')} />
        <div className={styles.stakeSection}>
          <LiskAmountFormatted
            val={unlockable}
            token={token}
            message={t('when the locking period ends.')}
          />
        </div>
        {rewards.total && (
          <div className={styles.rewardsSection}>
            <RewardAmountFormatted
              val={rewards.total}
              token={token}
              message={t('will be credited to your account due to changes in stakes.')}
            />
          </div>
        )}
      </>
    );
  }
  return '';
};

const stakeStatusMessages = (t, statusInfo, token, formProps) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Tokens are staked'),
    message: getSuccessMessage(
      t,
      statusInfo.locked,
      statusInfo.unlockable,
      statusInfo.selfUnstake,
      token,
      formProps || {}
    ),
  },
});

export default stakeStatusMessages;
