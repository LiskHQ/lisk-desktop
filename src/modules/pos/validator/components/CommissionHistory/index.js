import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import CommissionHistoryRow from './CommissionHistoryRow';
import styles from './styles.css';

const CommissionHistory = () => {
  const { t } = useTranslation();
  const timestamp = '20 Nov 2023, 10:12:28 AM';
  const oldCommission = '100';
  const newCommission = '90';
  return (
    <Dialog hasClose>
      <Box className={`${grid.col} ${styles.historyContainer} history-container`}>
        <BoxHeader className={styles.header}>
          <h1>{t('Commission history')}</h1>
          <h6>{t('Below are the commission history for this validator.')}</h6>
        </BoxHeader>
        <BoxContent className={styles.wrapper}>
          <div
            className={`${grid.row} ${styles.historyDetailsContainer} history-details-container`}
          >
            <div className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-6']}`}>Date</div>
            <div className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']}`}>
              Old commission (%)
            </div>
            <div className={`${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']}`}>
              New commission (%)
            </div>
          </div>
          <CommissionHistoryRow
            timestamp={timestamp}
            oldCommission={oldCommission}
            newCommission={newCommission}
            isLatest
          />
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default CommissionHistory;
