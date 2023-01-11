import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTheme } from '@theme/Theme';
import { tokenMap } from '@token/fungible/consts/tokens';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import BoxHeader from '@theme/box/header';
import Icon from '@theme/Icon';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import DateTimeFromTimestamp from 'src/modules/common/components/timestamp';
import TokenAmount from '@token/fungible/components/tokenAmount';
import styles from './ValidatorProfile.css';

const DetailsView = ({ data }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { rank } = data;
  const status = data.status || '';
  const {
    data: { timestamp: latestBlockTimestamp },
  } = useLatestBlock();

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
            <div className={`${styles.value} ${styles.capitalized}`}>{status.toLowerCase()}</div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="weight" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Validator weight')}</div>
            <div className={styles.value}>
              <TokenAmount val={data.validatorWeight} token={tokenMap.LSK.key} />
            </div>
          </div>
        </div>
        <div className={`${grid.row} ${styles.itemContainer}`}>
          <Icon name="calendar" className={styles.icon} />
          <div className={`${grid.col} ${styles.item}`}>
            <div className={`${styles.title} ${theme}`}>{t('Last block forged')}</div>
            <div className={styles.value}>
              {latestBlockTimestamp ? (
                <DateTimeFromTimestamp fulltime className="date" time={latestBlockTimestamp} />
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
