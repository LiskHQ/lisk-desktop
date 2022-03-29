import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTheme } from '@views/contexts/theme';
import { tokenMap } from '@token/configuration/tokens';
import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import BoxHeader from '@basics/box/header';
import Icon from '@basics/icon';
import DateTimeFromTimestamp from '@basics/timestamp';
import LiskAmount from '@shared/liskAmount';
import { getStatus } from './performanceView';
import styles from './delegateProfile.css';

const DetailsView = ({ t, data, lastBlockForged }) => {
  const theme = useTheme();
  const { rank } = data;
  const status = getStatus(data);

  return (
    <Box className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']} ${styles.detailsContainer} details-container`}>
      <BoxHeader>
        <h1 className={styles.heading}>{t('Details')}</h1>
      </BoxHeader>
      <BoxContent className={`${styles.details} details`}>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="star" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Rank')}</div>
            <div className={styles.value}>{rank || '-'}</div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="clockActive" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Status')}</div>
            <div className={`${styles.value} ${styles.capitalized}`}>
              { status.toLowerCase() }
            </div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="weight" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Delegate weight')}</div>
            <div className={styles.value}>
              <LiskAmount val={data.totalVotesReceived} token={tokenMap.LSK.key} />
            </div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="calendar" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Last block forged')}</div>
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
};

export default DetailsView;
