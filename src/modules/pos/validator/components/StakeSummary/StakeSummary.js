import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import TransactionSummary from '@transaction/manager/transactionSummary';
import StakeStats from '../StakeStats';

import styles from './styles.css';

const calculateAccumulatedStakes = ({ added, removed, edited }) => {
  let unlockable = Object.values(removed).reduce((accumulator, { confirmed }) => {
    accumulator += BigInt(confirmed);
    return accumulator;
  }, BigInt(0));

  let locked = Object.values(added).reduce((accumulator, { unconfirmed }) => {
    accumulator += BigInt(unconfirmed);
    return accumulator;
  }, BigInt(0));

  const editedStake = Object.values(edited).reduce((accumulator, { confirmed, unconfirmed }) => {
    accumulator += BigInt(unconfirmed) - BigInt(confirmed);
    return accumulator;
  }, BigInt(0));

  if (editedStake >= BigInt(0)) {
    locked += editedStake;
  } else {
    unlockable += editedStake * BigInt(-1);
  }

  return { locked, unlockable };
};

const StakeSummary = ({
  t,
  removed = {},
  edited = {},
  added = {},
  selfUnstake = {},
  prevStep,
  nextStep,
  formProps,
  transactionJSON,
  stakesSubmitted,
  selectedPriority,
}) => {
  const { locked, unlockable } = calculateAccumulatedStakes({ added, removed, edited });

  const onConfirm = () => {
    nextStep({
      formProps,
      transactionJSON,
      actionFunction: stakesSubmitted,
      statusInfo: {
        locked,
        unlockable,
        selfUnstake,
      },
    });
  };

  const onConfirmAction = {
    label: t('Confirm'),
    onClick: onConfirm,
  };
  const onCancelAction = {
    label: t('Edit'),
    onClick: prevStep,
  };

  return (
    <Dialog hasClose className={`${styles.wrapper}`}>
      <TransactionSummary
        hasCancel
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        className={styles.container}
        summaryInfo={{ added, edited, removed }}
        formProps={formProps}
        transactionJSON={transactionJSON}
        selectedPriority={selectedPriority}
      >
        <div className={styles.headerContainer}>
          <header>{t('Staking Summary')}</header>
          <StakeStats
            t={t}
            heading={t('Staking Summary')}
            added={Object.keys(added).length}
            edited={Object.keys(edited).length}
            removed={Object.keys(removed).length}
          />
        </div>
      </TransactionSummary>
    </Dialog>
  );
};

export default StakeSummary;
