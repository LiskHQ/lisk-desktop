import React from 'react';
import { withTranslation } from 'react-i18next';
import { tokenMap } from '../../../../constants/tokens';

import LiskAmount from '../../../shared/liskAmount';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import ToggleIcon from '../toggleIcon';
import VoteStats from '../voteStats';

import styles from './styles.css';

const token = tokenMap.LSK.key;

const ItemList = ({ items, heading }) => (
  <div className={styles.contentItem}>
    <span className={styles.contentHeading}>{heading}</span>
    <div className={styles.voteItems}>
      {Object.keys(items).map((address, i) => (
        <span key={i} className={styles.voteItem}>
          <span className={styles.addressText}>{address}</span>
          <span>
            {Object.values(items[address]).length === 2
              ? (
                <>
                  <LiskAmount val={items[address].confirmed} token={token} />
                  <span>{'->'}</span>
                  <LiskAmount val={items[address].unconfirmed} token={token} />
                </>
              )
              : <LiskAmount val={Object.values(items[address])[0]} token={token} />
            }
          </span>
        </span>
      ))}
    </div>
  </div>
);

const InfoColumn = ({ title, children }) => (
  <div className={styles.infoColumn}>
    <span className={styles.infoTitle}>{title}</span>
    <span className={styles.infoValue}>
      {children}
    </span>
  </div>
);

const Summary = ({
  t, removed, edited, added, fee, prevStep, nextStep,
}) => {
  const addedLength = Object.keys(added).length;
  const editedLength = Object.keys(edited).length;
  const removedLength = Object.keys(removed).length;

  return (
    <section>
      <Box className={styles.container}>
        <ToggleIcon isNotHeader />
        <VoteStats
          t={t}
          heading={t('Voting Summary')}
          added={addedLength}
          edited={editedLength}
          removed={removedLength}
        />
        <BoxContent className={styles.content}>
          {addedLength ? <ItemList heading={t('Added votes')} items={added} /> : null}
          {editedLength ? <ItemList heading={t('Changed votes')} items={edited} /> : null}
          {removedLength ? <ItemList heading={t('Removed votes')} items={removed} /> : null}
          <div className={styles.infoContainer}>
            <InfoColumn title={t('Total votes after confirmation')}>{`${addedLength + editedLength}/10`}</InfoColumn>
            <InfoColumn title={t('Transaction fee')}>
              <LiskAmount val={fee} />
            </InfoColumn>
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
};

export default withTranslation()(Summary);
