import React from 'react';

import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';

import styles from './styles.css';

const vote1 = { rank: '123', username: 'haha', amount: '10000' };
const votes = new Array(4).fill(vote1);

const ItemList = ({ items }) => (
  <div className={styles.voteItems}>
    {items.map((item, i) => (
      <span key={i} className={styles.voteItem}>
        <span className={styles.rankText}>{`#${item.rank} `}</span>
        <span>
          {`${item.username} - `}
          <LiskAmount val={item.amount} />
        </span>
      </span>
    ))}
  </div>
);

const Summary = ({
  t = s => s, removedVotes = votes, editedVotes = votes, addedVotes = votes,
  fee = 100, prevStep, nextStep,
}) => (
  <section>
    <Box className={styles.container}>
      <ToggleIcon isNotHeader />
      <VoteStats
        t={t}
        heading={t('Voting Summary')}
        added={addedVotes.length}
        edited={editedVotes.length}
        removed={removedVotes.length}
      />
      <BoxContent className={styles.content}>
        <div className={styles.contentItem}>
          <span className={styles.contentHeading}>{t('Added votes')}</span>
          <ItemList items={addedVotes} />
        </div>
        <div className={styles.contentItem}>
          <span className={styles.contentHeading}>{t('Changed votes')}</span>
          <ItemList items={editedVotes} />
        </div>
        <div className={styles.contentItem}>
          <span className={styles.contentHeading}>{t('Removed votes')}</span>
          <ItemList items={removedVotes} />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoColumn}>
            <span className={styles.infoTitle}>{t('Total votes after confirmation')}</span>
            <span>
              {`${addedVotes.length + editedVotes.length}/10`}
            </span>
          </div>
          <div className={styles.infoColumn}>
            <span className={styles.infoTitle}>{t('Transaction fee')}</span>
            <span>{fee}</span>
          </div>

        </div>
      </BoxContent>
      <BoxFooter className={styles.footer} direction="horizontal">
        <SecondaryButton onClick={prevStep}>Edit</SecondaryButton>
        <PrimaryButton size="l" onClick={nextStep}>
          {t('Confirm')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  </section>
);

export default Summary;
