import React, { useEffect } from 'react';

import Piwik from '@utils/piwik';
import TransactionInfo from '@shared/TransactionInfo';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
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
  t, removed = {}, edited = {}, added = {},
  fee, account, prevStep, nextStep, transactions, ...props
}) => {
  const {
    locked, unlockable,
  } = getResultProps({ added, removed, edited });

  useEffect(() => {
    if (!transactions.transactionsCreatedFailed.length
      && transactions.transactionsCreated.length) {
      nextStep({
        locked, unlockable, error: false,
      });
    } else if (transactions.transactionsCreatedFailed.length) {
      nextStep({
        error: true,
      });
    }
  }, [transactions]);

  const submitTransaction = () => {
    const { normalizedVotes, votesSubmitted } = props;
    Piwik.trackingEvent('Vote_SubmitTransaction', 'button', 'Next step');

    votesSubmitted({
      fee: String(fee),
      votes: normalizedVotes,
    });
  };

  return (
    <section>
      <Box className={styles.container}>
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
        <BoxContent className={styles.content}>
          <TransactionInfo added={added} edited={edited} removed={removed} fee={fee} />
        </BoxContent>
        <BoxFooter className={styles.footer} direction="horizontal">
          <SecondaryButton onClick={prevStep} className="edit-button">Edit</SecondaryButton>
          <PrimaryButton className="confirm" size="l" onClick={submitTransaction}>
            {t('Confirm')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Summary;
