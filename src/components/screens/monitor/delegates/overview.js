import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Chart from '../../../toolbox/charts';
import styles from './overview.css';

const Overview = ({
  delegateForgingData,
  delegateRegisteredData,
  delegateStatusData,
  t,
}) => (
  <Box>
    <BoxHeader>
      <h1>{t('Overview')}</h1>
    </BoxHeader>
    <div className={styles.container}>
      <div className={styles.graphContainer}>
        {
          delegateStatusData
            ? <Chart type="doughnut" data={delegateStatusData} />
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
      <div className={styles.graphContainer}>
        {
          delegateForgingData
            ? <Chart type="doughnut" data={delegateForgingData} />
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
      <div className={styles.graphContainer}>
        {
          delegateRegisteredData
            ? <Chart type="line" data={delegateRegisteredData} />
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
    </div>
  </Box>
);

export default Overview;
