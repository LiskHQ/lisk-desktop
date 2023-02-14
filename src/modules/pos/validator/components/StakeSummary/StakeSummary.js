import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import TransactionSummary from '@transaction/manager/transactionSummary';
import StakeStats from '../StakeStats';

import styles from './styles.css';

const getResultProps = ({ added, removed, edited }) => {
  let unlockable = Object.values(removed).reduce((sum, { confirmed }) => {
    sum += confirmed;
    return sum;
  }, 0);

  let locked = Object.values(added).reduce((sum, { unconfirmed }) => {
    sum += unconfirmed;
    return sum;
  }, 0);

  const editedWeight = Object.values(edited).reduce((sum, { confirmed, unconfirmed }) => {
    sum += unconfirmed - confirmed;
    return sum;
  }, 0);

  if (editedWeight > 0) {
    locked += editedWeight;
  } else {
    unlockable += Math.abs(editedWeight);
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
  const { locked, unlockable } = getResultProps({ added, removed, edited });

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
