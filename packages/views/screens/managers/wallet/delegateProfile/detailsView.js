import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTheme } from 'src/theme/Theme';
import { tokenMap } from '@token/fungible/consts/tokens';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import Icon from 'src/theme/Icon';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { getStatus } from './performanceView';
import styles from './delegateProfile.css';

const DetailsView = ({ t, data, lastBlockForged }) => {
  const theme = useTheme();
  const { rank } = data;
  const status = getStatus(data);

  return (
    <Box
      className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']} ${styles.detailsContainer} details-container`}
    >
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
              {status.toLowerCase()}
            </div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="weight" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>
              {t('Delegate weight')}
            </div>
            <div className={styles.value}>
              <TokenAmount
                val={data.totalVotesReceived}
                token={tokenMap.LSK.key}
              />
            </div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="calendar" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>
              {t('Last block forged')}
            </div>
            <div className={styles.value}>
              {lastBlockForged ? (
                <DateTimeFromTimestamp
                  fulltime
                  className="date"
                  time={lastBlockForged}
                />
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default DetailsView;
