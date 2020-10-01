import React from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Icon from '../../../toolbox/icon';
import { fromRawLsk } from '../../../../utils/lsk';
import { getDelayedAvailability, isBlockHeightReached } from '../../../../utils/account';
import styles from './lockedBalance.css';

const getPendingTime = ({ unvoteHeight, delegateAddress }, currentBlockHeight, { address }) => {
  const isSelfVote = address === delegateAddress;
  const delayedAvailability = getDelayedAvailability(isSelfVote);
  const awaitingBlocks = delayedAvailability - (currentBlockHeight - unvoteHeight);
  const secondsToUnlockAllBalance = awaitingBlocks * 10;
  const momentSeconds = moment().second(secondsToUnlockAllBalance);
  return moment().to(momentSeconds, true);
};

const BalanceTable = ({
  t,
  lockedBalance,
  availableBalance,
  currentBlock,
  account,
}) => (
  <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
    <li>
      <p className={styles.columnTitle}>{t('Amount')}</p>
      <p className={styles.columnTitle}>{t('Status')}</p>
    </li>
    <li>
      <p>{`${fromRawLsk(lockedBalance)} LSK`}</p>
      <p>
        <Icon name="lock" />
        {t('locked')}
      </p>
    </li>
    {account.unlocking.length > 0
      && (
        account.unlocking
          .sort((voteA, voteB) => voteB.unvoteHeight - voteA.unvoteHeight)
          .map((vote, i) => {
            if (isBlockHeightReached(vote, currentBlock, account.address)) return false;
            return (
              <li key={`${i}-unlocking-balance-list`}>
                <p>{`${fromRawLsk(vote.amount)} LSK`}</p>
                <p>
                  <Icon name="loading" />
                  {`${t('will be available to unlock in')} ${getPendingTime(vote, currentBlock.height, account)}`}
                </p>
              </li>
            );
          })
      )
    }
    <li>
      <p>{`${fromRawLsk(availableBalance)} LSK`}</p>
      <p>
        <Icon name="unlock" />
        {t('available to unlock')}
      </p>
    </li>
  </ul>
);

export default withTranslation()(BalanceTable);
