// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import Chart from '../../../toolbox/charts';
import { typeLine, typeDoughnut } from '../../../../constants/chartConstants';
import styles from './overview.css';

const Overview = ({
  chartActiveAndStandby,
  chartDelegatesForging,
  chartRegisteredDelegates,
  delegatesForgedLabels,
  t,
}) => {
  const getAmountOfDelegatesInTime = () => {
    const totalDelegates = chartActiveAndStandby.data;
    const final = [totalDelegates];
    chartRegisteredDelegates.data
      .map(delegate => (delegate.y))
      .reduce((amountOfDelegates, amountOfDelegatesByMonth) => {
        final.unshift(amountOfDelegates - amountOfDelegatesByMonth);
        return amountOfDelegates - amountOfDelegatesByMonth;
      }, totalDelegates);

    return final;
  };

  const getAmountOfDelegatesLabels = () => {
    const labels = chartRegisteredDelegates.data.map(date => date.x);
    labels.push('Now');
    return labels;
  };

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Overview')}</h1>
      </BoxHeader>
      <div className={styles.container}>
        <div className={styles.graphContainer}>
          {
            typeof chartActiveAndStandby.data === 'number'
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.chartTitle}>{t('Delegates')}</h2>
                  <div className={styles.chart}>
                    <Chart
                      type={typeDoughnut}
                      data={{
                        labels: [t('Standby delegates'), t('Active delegates')],
                        datasets: [
                          {
                            label: 'delegates',
                            data: [chartActiveAndStandby.data - 101, 101],
                          },
                        ],
                      }}
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
            chartDelegatesForging.data.length
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.chartTitle}>{t('Delegates Forging Status')}</h2>
                  <div className={styles.chart}>
                    <Chart
                      type={typeDoughnut}
                      data={{
                        labels: delegatesForgedLabels,
                        datasets: [
                          {
                            label: 'status',
                            data: Object.values(chartDelegatesForging.data
                              .reduce((acc, delegate) => {
                                acc[delegate.status] += 1;
                                return acc;
                              }, {
                                forgedThisRound: 0,
                                forgedLastRound: 0,
                                notForging: 0,
                                missedLastRound: 0,
                              })),
                          },
                        ],
                      }}
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
            chartRegisteredDelegates.data.length
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.chartTitle}>{t('Registered Delegates')}</h2>
                  <div className={styles.chart}>
                    <Chart
                      type={typeLine}
                      data={{
                        labels: getAmountOfDelegatesLabels(),
                        datasets: [
                          {
                            data: getAmountOfDelegatesInTime(),
                          },
                        ],
                      }}
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
};

export default Overview;
