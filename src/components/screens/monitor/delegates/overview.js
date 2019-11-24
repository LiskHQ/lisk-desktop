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
    const labels = chartRegisteredDelegates.data.map(delegate => (delegate.x));
    labels.push('Now');
    return labels;
  };

  const activeAndStandby = {
    labels: [t('Standby delegates'), t('Active delegates')],
    datasets: [
      {
        label: 'delegates',
        data: typeof chartActiveAndStandby.data === 'number'
          ? [chartActiveAndStandby.data - 101, 101]
          : [],
      },
    ],
  };

  const delegateForgingStatus = {
    labels: delegatesForgedLabels,
    datasets: [
      {
        data: chartDelegatesForging.data.length
          ? Object.values(chartDelegatesForging.data.reduce((acc, delegate) => {
            acc[delegate.status] += 1;
            return acc;
          }, {
            forgedThisRound: 0,
            forgedLastRound: 0,
            notForging: 0,
            missedLastRound: 0,
          }))
          : [],
      },
    ],
  };

  const registeredDelegates = {
    labels: getAmountOfDelegatesLabels(),
    datasets: [
      {
        data: chartRegisteredDelegates.data.length
          ? getAmountOfDelegatesInTime()
          : [],
      },
    ],
  };

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Overview')}</h1>
      </BoxHeader>
      <div className={styles.container}>
        <div className={styles.graphContainer}>
          {
            activeAndStandby.datasets[0].data.length
              ? (
                <div className={styles.chartBox}>
                  <h1 className={styles.chartTitle}>{t('Delegates')}</h1>
                  <div className={styles.chart}>
                    <Chart
                      type={typeDoughnut}
                      data={activeAndStandby}
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
                  <h1 className={styles.chartTitle}>{t('Delegates Forging Status')}</h1>
                  <div className={styles.chart}>
                    <Chart
                      type={typeDoughnut}
                      data={delegateForgingStatus}
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
};

export default Overview;
