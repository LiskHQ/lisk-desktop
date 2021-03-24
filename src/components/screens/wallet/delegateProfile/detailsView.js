import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '@constants';
import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxHeader from '../../../toolbox/box/header';
import styles from './delegateProfile.css';
import Icon from '../../../toolbox/icon';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';

const DetailsView = ({
  t, rank, voteWeight, lastBlockForged, status,
}) => (
  <Box className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-4']} ${styles.detailsContainer} details-container`}>
    <BoxHeader>
      <h1 className={styles.heading}>{t('Details')}</h1>
    </BoxHeader>
    <BoxContent className={`${styles.details} details`}>
      <div className={`${grid.row} ${styles.itemContainer}`}>
        <Icon name="star" className={styles.icon} />
        <div className={`${grid.col} ${styles.item}`}>
          <div className={styles.title}>Rank</div>
          <div className={styles.value}>{rank || '-'}</div>
        </div>
      </div>
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
      <div className={`${grid.row} ${styles.itemContainer}`}>
        <Icon name="calendar" className={styles.icon} />
        <div className={`${grid.col} ${styles.item}`}>
          <div className={styles.title}>Last Block Forged</div>
          <div className={styles.value}>
            {lastBlockForged ? (
              <DateTimeFromTimestamp
                fulltime
                className="date"
                time={lastBlockForged}
                token={tokenMap.LSK.key}
              />
            ) : '-' }
          </div>
        </div>
      </div>
    </BoxContent>
  </Box>
);

export default DetailsView;
