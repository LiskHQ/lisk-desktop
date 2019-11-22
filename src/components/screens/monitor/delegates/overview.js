// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Chart from '../../../toolbox/charts';
import { typeLine, typeDoughnut } from '../../../../constants/chartConstants';
import styles from './overview.css';

const Overview = ({
  activeAndStandbyData,
  delegateForgingData,
  registeredDelegates,
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
                  <Chart
                    type={typeDoughnut}
                    data={activeAndStandbyData}
                    options={{
                      tooltips: {
                        callbacks: {
                          title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                          label(tooltipItem, data) {
                            return data.datasets[0].data[tooltipItem.index];
                          },
                        },
                      },
                    }}
                  />
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
                  <Chart
                    type={typeDoughnut}
                    data={delegateForgingData}
                    options={{
                      tooltips: {
                        callbacks: {
                          title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
                          label(tooltipItem, data) {
                            return data.datasets[0].data[tooltipItem.index];
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
        }
      </div>
      <div className={styles.graphContainer}>
        {
          registeredDelegates.datasets[0].data.length
            ? (
              <div className={styles.chartBox}>
                <h1 className={styles.chartTitle}>{t('Registered Delegates')}</h1>
                <div className={styles.chart}>
                  <Chart
                    type={typeLine}
                    data={registeredDelegates}
                    options={{ legend: { display: false } }}
                  />
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
