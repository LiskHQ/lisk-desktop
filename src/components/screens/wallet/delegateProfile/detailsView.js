import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxHeader from '../../../toolbox/box/header';
import styles from './delegateProfile.css';
import Icon from '../../../toolbox/icon';

const DetailsView = ({
  t, rank, voteWeight, lastBlockForged, status,
}) => (
  <Box className={`${grid.col} ${grid['col-xs-6']} ${grid['col-md-4']} ${grid['col-lg-4']} details-container`}>
    <BoxHeader>
      <h1>{t('Details')}</h1>
    </BoxHeader>
    <BoxContent className={`${styles.details} details`}>
      {rank && (
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="star" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={styles.title}>Rank</div>
            <div className={styles.value}>{rank}</div>
          </div>
        </div>
      )}
      {status && (
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="clockActive" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={styles.title}>Status</div>
            <div className={styles.value}>{status}</div>
          </div>
        </div>
      )}
      <div className={`${grid.row} ${styles.itemContainer}`}>
        <Icon name="weight" className={styles.icon} />
        <div className={`${grid.col} ${styles.item}`}>
          <div className={styles.title}>Vote Weight</div>
          <div className={styles.value}>{voteWeight}</div>
        </div>
      </div>
      {lastBlockForged && (
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="calendar" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={styles.title}>Last Block Forged</div>
            <div className={styles.value}>{lastBlockForged}</div>
          </div>
        </div>
      )}
    </BoxContent>
  </Box>
);

export default DetailsView;
