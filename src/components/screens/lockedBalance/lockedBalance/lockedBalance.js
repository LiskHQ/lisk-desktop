import React, { useState } from 'react';
import moment from 'moment';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import BoxHeader from '../../../toolbox/box/header';
import { PrimaryButton } from '../../../toolbox/buttons';
import Icon from '../../../toolbox/icon';
import TransactionPriority from '../../../shared/transactionPriority';
import Piwik from '../../../../utils/piwik';
import { toRawLsk, fromRawLsk } from '../../../../utils/lsk';
import styles from './lockedBalance.css';
import useTransactionPriority from '../../send/form/useTransactionPriority';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import transactionTypes from '../../../../constants/transactionTypes';
import { calculateLockedBalance, calculateAvailableAndUnlockingBalance, getAvailableUnlockingTransactions } from '../../../../utils/account';
import { unlockTxDelayAvailability } from '../../../../constants/account';

const txType = transactionTypes().unlockToken.key;

const calculatePendingTime = (currentBlockHeight, { unlocking, address }) => {
  const awaitingBlocks = unlocking.map(({ unvoteHeight, delegateAddress }) => {
    const delayedAvailability = address === delegateAddress
      ? unlockTxDelayAvailability.selfUnvote : unlockTxDelayAvailability.unvote;
    return delayedAvailability - (currentBlockHeight - unvoteHeight);
  });
  const highestAwaitingBlocksNumber = Math.max(...awaitingBlocks);
  const secondsToUnlockAllBalance = highestAwaitingBlocksNumber * 10;
  return moment().to(moment().second(secondsToUnlockAllBalance));
};

const LockedBalance = ({
  t, nextStep, token, currentBlock,
  unlockBalanceSubmitted, account,
}) => {
  const lockedBalance = calculateLockedBalance(account);
  const {
    unlockingBalance,
    availableBalance,
  } = calculateAvailableAndUnlockingBalance(
    account,
    currentBlock,
  );
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);
  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      amount: toRawLsk(availableBalance),
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
    },
  });

  const onClickUnlock = () => {
    Piwik.trackingEvent('Send_SubmitTransaction', 'button', 'Next step');
    const selectedFee = customFee ? customFee.value : fee.value;
    unlockBalanceSubmitted({
      nonce: account.nonce,
      fee: `${toRawLsk(parseFloat(selectedFee))}`,
      passphrase: account.passphrase,
      unlockingObjects: getAvailableUnlockingTransactions(account, currentBlock),
    });
    nextStep();
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader className={styles.header}>
        <h1>{t('Locked balance details')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <p>{t('Find details of your locked balance and the unlock waiting period. Use this panel to submit an unlock request when waiting periods are over.')}</p>
        <div className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
          <div>
            <p className={styles.columnTitle}>{t('Amount')}</p>
            <p>{`${fromRawLsk(lockedBalance)} LSK`}</p>
            <p>{`${fromRawLsk(unlockingBalance)} LSK`}</p>
            <p>{`${fromRawLsk(availableBalance)} LSK`}</p>
          </div>
          <div>
            <p className={styles.columnTitle}>{t('Status')}</p>
            <p>
              <Icon name="lock" />
              {t('locked')}
            </p>
            <p>
              <Icon name="loading" />
              {t('will be available to unlock in')}
              {(currentBlock && unlockingBalance)
                && calculatePendingTime(currentBlock.height, account)
              }
            </p>
            <p>
              <Icon name="unlock" />
              {t('available to unlock')}
            </p>
          </div>
        </div>
        <TransactionPriority
          token={token}
          fee={fee}
          minFee={minFee.value}
          customFee={customFee ? customFee.value : undefined}
          txType={txType}
          setCustomFee={setCustomFee}
          priorityOptions={priorityOptions}
          selectedPriority={selectedPriority.selectedIndex}
          setSelectedPriority={selectTransactionPriority}
        />
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          className="unlock-btn"
          onClick={onClickUnlock}
          disabled={availableBalance === 0}
        >
          {t(`Unlock ${fromRawLsk(availableBalance)} LSK`)}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default LockedBalance;
