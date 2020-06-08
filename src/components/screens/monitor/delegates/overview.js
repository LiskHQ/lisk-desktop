// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import { DoughnutChart, LineChart } from '../../../toolbox/charts';
import styles from './overview.css';

const getForgingStats = (data) => {
  const statuses = {
    forging: 0,
    awaitingSlot: 0,
    notForging: 0,
    missedBlock: 0,
  };
  Object.values(data)
    .forEach((item) => {
      statuses[item.status]++;
    });
  return Object.values(statuses);
};

const Overview = ({
  chartActiveAndStandby,
  chartDelegatesForging,
  chartRegisteredDelegates,
  t,
}) => {
  const delegatesForgedLabels = [
    t('Forging'),
    t('Awaiting slot'),
    t('Not forging'),
    t('Missed block'),
  ];
  const getAmountOfDelegatesInTime = () => {
    const totalDelegates = chartActiveAndStandby.data;
    const final = [totalDelegates];
    let allPositiveValues = true;
    chartRegisteredDelegates.data
      .map(delegate => (delegate.y))
      .reduce((amountOfDelegates, amountOfDelegatesByMonth) => {
        final.unshift(amountOfDelegates - amountOfDelegatesByMonth);
        allPositiveValues = allPositiveValues && amountOfDelegates - amountOfDelegatesByMonth > 0;
        return amountOfDelegates - amountOfDelegatesByMonth;
      }, totalDelegates);

    return allPositiveValues ? final : [];
  };

  const getAmountOfDelegatesLabels = () => {
    const labels = chartRegisteredDelegates.data.map(date => date.x);
    labels.push('Now');
    return labels;
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Overview')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {
            typeof chartActiveAndStandby.data === 'number'
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Delegates')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: [t('Standby delegates'), t('Active delegates')],
                        datasets: [
                          {
                            label: 'delegates',
                            data: [Math.max(0, chartActiveAndStandby.data - 101), 101],
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
        <div className={styles.column}>
          {
            Object.keys(chartDelegatesForging).length
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Delegates Forging Status')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: delegatesForgedLabels,
                        datasets: [
                          {
                            label: 'status',
                            data: getForgingStats(chartDelegatesForging),
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
        <div className={styles.column}>
          {
            chartRegisteredDelegates.data.length
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Registered Delegates')}</h2>
                  <div className={styles.chart}>
                    <LineChart
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
      </BoxContent>
    </Box>
  );
};

export default Overview;
