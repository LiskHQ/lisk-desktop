import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './blocksOverview.css';

const BlocksOverview = ({ t }) => (
  <Box>
    <BoxHeader>
      <h2>{t('Overview')}</h2>
    </BoxHeader>
    <BoxContent>
      <div className={grid.row}>
        <div className={grid['col-sm-8']}>
          <h2 className={styles.cellHeader}>{t('Transactions per block')}</h2>
        </div>
        <div className={grid['col-sm-4']}>
          <h2 className={styles.cellHeader}>{t('Empty/Not empty')}</h2>
        </div>
      </div>
    </BoxContent>
  </Box>
);

export default BlocksOverview;
