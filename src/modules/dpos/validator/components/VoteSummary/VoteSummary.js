import React from 'react';
import TransactionSummary from '@transaction/manager/transactionSummary';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../VoteStats';

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

const VoteSummary = ({
  t, removed = {}, edited = {}, added = {}, selfUnvote = {},
  prevStep, nextStep, rawTx, votesSubmitted,
}) => {
  const {
    locked, unlockable,
  } = getResultProps({ added, removed, edited });

  const onConfirm = () => {
    nextStep({
      rawTx,
      actionFunction: votesSubmitted,
      statusInfo: {
        locked, unlockable, selfUnvote,
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
    <TransactionSummary
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      classNames={styles.container}
      summaryInfo={{ added, edited, removed }}
      rawTx={rawTx}
    >
      <ToggleIcon isNotHeader />
      <div className={styles.headerContainer}>
        <header>
          {t('Voting Summary')}
        </header>
        <VoteStats
          t={t}
          heading={t('Voting Summary')}
          added={Object.keys(added).length}
          edited={Object.keys(edited).length}
          removed={Object.keys(removed).length}
        />
      </div>
    </TransactionSummary>
  );
};

export default VoteSummary;
