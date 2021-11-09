import React, { useEffect, useState } from 'react';
import { fromRawLsk } from '@utils/lsk';
import Piwik from '@utils/piwik';
import { isEmpty } from '@utils/helpers';
import TransactionInfo from '@shared/transactionInfo';
import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import TransactionSummary from '@shared/transactionSummary';
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
  fee, account, prevStep, nextStep, transactions, transactionDoubleSigned, ...props
}) => {
  const [secondPass, setSecondPass] = useState('');
  const {
    locked, unlockable,
  } = getResultProps({ added, removed, edited });

  useEffect(() => {
    const { normalizedVotes, votesSubmitted } = props;

    votesSubmitted({
      fee: String(fee),
      votes: normalizedVotes,
    });
  }, []);

  useEffect(() => {
    if (secondPass) {
      transactionDoubleSigned({ secondPass });
    }
  }, [secondPass]);

  const submitTransaction = () => {
    if (!account.summary.isMultisignature || secondPass) {
      Piwik.trackingEvent('Vote_SubmitTransaction', 'button', 'Next step');
      if (!transactions.txSignatureError
        && !isEmpty(transactions.signedTransaction)) {
        nextStep({
          locked, unlockable, error: false, selfUnvote,
        });
      } else if (transactions.txSignatureError) {
        nextStep({
          error: true,
        });
      }
    }
  };

  const onConfirmAction = {
    label: t('Confirm'),
    onClick: submitTransaction,
  };
  const onCancelAction = {
    label: t('Edit'),
    onClick: prevStep,
  };

  return (
    <TransactionSummary
      t={t}
      account={account}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      classNames={styles.container}
      fee={!account.summary.isMultisignature && fromRawLsk(fee)}
      createTransaction={(callback) => {
        callback(transactions.signedTransaction);
      }}
      keys={account.keys}
      setSecondPass={setSecondPass}
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
        transaction={transactions.signedTransaction}
        account={account}
        isMultisignature={account.summary.isMultisignature}
      />
    </TransactionSummary>
  );
};

export default Summary;
