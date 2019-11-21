// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Chart from '../../../toolbox/charts';
import styles from './overview.css';

const Overview = ({
  delegateForgingData,
  activeAndStandbyData,
  options,
  t,
}) => (
  <Box>
    <BoxHeader>
      <h1>{t('Overview')}</h1>
    </BoxHeader>
    <div className={styles.container}>
      <div className={styles.graphContainer}>
        {
          activeAndStandbyData.datasets[0].data.length
            ? (
              <div className={styles.chartBox}>
                <h1 className={styles.chartTitle}>{t('Delegates')}</h1>
                <div className={styles.chart}>
                  <Chart type="doughnut" data={activeAndStandbyData} options={options} />
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
      <div className={styles.graphContainer}>
        {
          delegateForgingData.datasets[0].data.length
            ? (
              <div className={styles.chartBox}>
                <h1 className={styles.chartTitle}>{t('Delegates Forging Status')}</h1>
                <div className={styles.chart}>
                  <Chart type="doughnut" data={delegateForgingData} options={options} />
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
      <div className={styles.graphContainer}>
        {
          delegateForgingData.datasets[0].data.length
            ? (
              <div className={styles.chartBox}>
                <h1 className={styles.chartTitle}>{t('Registered Delegates')}</h1>
                <div className={styles.chart}>
                  <Chart type="line" data={delegateForgingData} />
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
    </div>
  </Box>
);

export default Overview;
