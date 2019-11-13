import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';

const ForgingDetails = ({ t }) => (
  <Box>
    <BoxHeader>
      <h2>{t('Forging details')}</h2>
    </BoxHeader>
    <BoxContent>
      <div className={styles.contentWrapper}>
        <div>
          <h3>{t('Total forged')}</h3>
        </div>
        <div>
          <h3>{t('Next forgers')}</h3>
        </div>
        <div>
          <h3>{t('Last forger')}</h3>
        </div>
      </div>
    </BoxContent>
  </Box>
);

export default ForgingDetails;
