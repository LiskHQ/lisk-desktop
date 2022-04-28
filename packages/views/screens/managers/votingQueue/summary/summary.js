import React from 'react';
import { fromRawLsk } from '@token/utilities/lsk';
import TransactionInfo from '@transaction/components/transactionInfo';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import TransactionSummary from '@transaction/components/transactionSummary';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';

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

const Summary = ({
  t, removed = {}, edited = {}, added = {}, selfUnvote = {},
  fee, account, prevStep, nextStep,
  normalizedVotes, votesSubmitted,
}) => {
  const {
    locked, unlockable,
  } = getResultProps({ added, removed, edited });

  const onConfirm = () => {
    nextStep({
      rawTransaction: {
        fee: String(fee),
        votes: normalizedVotes,
      },
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

  const transaction = {
    nonce: account.sequence.nonce,
    fee,
    added,
    edited,
    removed,
  };

  return (
    <TransactionSummary
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      classNames={styles.container}
      fee={!account.summary.isMultisignature && fromRawLsk(fee)}
    >
      <ToggleIcon isNotHeader />
      <div className={styles.headerContainer}>
        <header>
          {t('Voting summary')}
        </header>
        <VoteStats
          t={t}
          heading={t('Voting summary')}
          added={Object.keys(added).length}
          edited={Object.keys(edited).length}
          removed={Object.keys(removed).length}
        />
      </div>
      <TransactionInfo
        added={added}
        edited={edited}
        removed={removed}
        fee={fee}
        moduleAssetId={MODULE_ASSETS_NAME_ID_MAP.voteDelegate}
        transaction={transaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
