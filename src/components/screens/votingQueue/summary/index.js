import React from 'react';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { PrimaryButton, SecondaryButton } from '../../../toolbox/buttons';
import ToggleIcon from '../toggleIcon';

import styles from './styles.css';

const Summary = ({
  t = s => s, removedVotes = [], editedVotes = [], addedVotes = [], fee = 100,
}) => (
  <section>
    <Box className={styles.container}>
      <ToggleIcon />
      <header>
        <h1>{t('Voting Summary')}</h1>
      </header>
      <BoxContent>
        <div>
          <span>{t('Added votes')}</span>
          <div>
            {addedVotes.map((vote, i) => <span key={i}>{vote}</span>)}
          </div>
        </div>
        <div>
          <span>{t('Changed votes')}</span>
          <div>
            {editedVotes.map((vote, i) => <span key={i}>{vote}</span>)}
          </div>
        </div>
        <div>
          <span>{t('Removed votes')}</span>
          <div>
            {removedVotes.map((vote, i) => <span key={i}>{vote}</span>)}
          </div>
        </div>
      </BoxContent>
      <BoxFooter className={styles.footer}>
        <div>
          <div className={styles.footerColumn}>
            <span>{t('Total votes after confirmation')}</span>
            <span>0/10</span>
          </div>
          <div className={styles.footerColumn}>
            <span>{t('Transaction fee')}</span>
            <span>{fee}</span>
          </div>

        </div>
        <div>
          <SecondaryButton>Edit</SecondaryButton>
          <PrimaryButton size="l">
            {t('Confirm')}
          </PrimaryButton>
        </div>
      </BoxFooter>
    </Box>
  </section>
);

export default Summary;
