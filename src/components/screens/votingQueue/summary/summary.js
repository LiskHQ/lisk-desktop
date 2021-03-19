import React, { useEffect } from 'react';

import Piwik from '@utils/piwik';
import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';
import VoteItem from '../../../shared/voteItem';

import styles from './styles.css';

const ItemList = ({ items, heading }) => (
  <div className={styles.contentItem}>
    <span className={styles.contentHeading}>{heading}</span>
    <div className={styles.voteItems}>
      {Object.keys(items).map(address => (
        <VoteItem
          key={`vote-item-${address}`}
          address={address}
          vote={items[address]}
          title={items[address].username}
        />
      ))}
    </div>
  </div>
);

const InfoColumn = ({ title, children, className }) => (
  <div className={`${styles.infoColumn} ${className}`}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

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
  const addedLength = Object.keys(added).length;
  const editedLength = Object.keys(edited).length;
  const removedLength = Object.keys(removed).length;

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
      passphrase: account.passphrase,
      senderPublicKey: account.info.LSK.publicKey,
      fee: String(fee),
      nonce: account.info.LSK.sequence?.nonce,
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
            added={addedLength}
            edited={editedLength}
            removed={removedLength}
          />
        </div>
        <BoxContent className={styles.content}>
          {addedLength ? <ItemList heading={t('Added votes')} items={added} /> : null}
          {editedLength ? <ItemList heading={t('Changed votes')} items={edited} /> : null}
          {removedLength ? <ItemList heading={t('Removed votes')} items={removed} /> : null}
          <div className={styles.infoContainer}>
            <InfoColumn title={t('Total votes after confirmation')} className="total-votes">{`${addedLength + editedLength}/10`}</InfoColumn>
            <InfoColumn title={t('Transaction fee')} className="fee">
              <LiskAmount val={fee} />
            </InfoColumn>
          </div>
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
