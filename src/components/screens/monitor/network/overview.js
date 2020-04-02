// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import { DoughnutChart } from '../../../toolbox/charts';
import styles from './overview.css';

const createOthers = (data) => {
  const list = {};
  let Others = 0;
  const sortedKeys = Object.entries(data)
    .sort((a, b) => a[1] - b[1])
    .reverse()
    .map(item => item[0]);
  sortedKeys.forEach((item, index) => {
    if (index < 3) {
      list[item] = data[item];
    } else {
      Others = data[item] + Others;
    }
  });
  return Others === 0
    ? data
    : { ...list, Others };
};
const Overview = ({
  networkStatus,
  t,
}) => {
  const { basic, coreVer, height } = networkStatus;
  const versionsDistribution = coreVer ? createOthers(coreVer) : null;
  const heightDistribution = height ? createOthers(height) : null;
  return (
    <Box>
      <BoxHeader>
        <h1>{t('Statistics')}</h1>
      </BoxHeader>
      <div className={`${styles.container} ${styles.overview}`}>
        <div className={styles.column}>
          {
            versionsDistribution
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Versions distribution')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: Object.keys(versionsDistribution),
                        datasets: [
                          {
                            data: Object.values(versionsDistribution),
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
              : <BoxEmptyState><p>{t('No height distribution information')}</p></BoxEmptyState>
          }
        </div>
        <div className={styles.column}>
          {
            heightDistribution
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Height distribution')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: Object.keys(heightDistribution),
                        datasets: [
                          {
                            data: Object.values(heightDistribution),
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
              : <BoxEmptyState><p>{t('No versions distribution information')}</p></BoxEmptyState>
          }
        </div>
        <div className={styles.column}>
          {
            basic
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Peers')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: [t('Connected'), t('Dsconnected')],
                        datasets: [
                          {
                            label: 'delegates',
                            data: [basic.connectedPeers, basic.disconnectedPeers],
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
              : <BoxEmptyState><p>{t('No peers information')}</p></BoxEmptyState>
          }
        </div>
      </div>
    </Box>
  );
};

export default Overview;
