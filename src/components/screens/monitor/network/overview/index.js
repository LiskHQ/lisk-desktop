// istanbul ignore file
import React from 'react';
import Box from '../../../../toolbox/box';
import BoxHeader from '../../../../toolbox/box/header';
import BoxContent from '../../../../toolbox/box/content';
import BoxEmptyState from '../../../../toolbox/box/emptyState';
import { DoughnutChart } from '../../../../toolbox/charts';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import OthersTooltip from './othersTooltip';
import styles from './overview.css';
import withResizeValues from '../../../../../utils/withResizeValues';

const Overview = ({
  networkStatus,
  t,
  isMediumViewPort
}) => {
  const createOthers = (data) => {
    const list = {
      labels: [],
      values: [],
      others: [],
    };
    let Others = 0;
    const sortedKeys = Object.entries(data)
      .sort((a, b) => a[1] - b[1])
      .reverse()
      .map(item => item[0]);
    sortedKeys.forEach((item, index) => {
      if (index < 3) {
        list.labels.push(item);
        list.values.push(data[item]);
      } else {
        list.others.push({
          label: item,
          value: data[item],
        });
        Others = data[item] + Others;
      }
    });
    if (Others > 0) {
      list.labels.push(t('Others'));
      list.values.push(Others);
    }
    return list;
  };
  const { basic, coreVer, height } = networkStatus;
  const versionsDistribution = coreVer ? createOthers(coreVer) : null;
  const heightDistribution = height ? createOthers(height) : null;
  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <div>
          <h1 className={styles.boxHeading}>
            {t('Network statistics')}
          </h1>
          <Tooltip position="bottom right" indent>
            <p>{t('Statistics shown only reflect the peers connected to the Lisk Service node.')}</p>
          </Tooltip>
        </div>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {
            versionsDistribution
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Versions distribution')}</h2>
                  <div className={styles.chart}>
                    <DoughnutChart
                      data={{
                        labels: versionsDistribution.labels,
                        datasets: [
                          {
                            data: versionsDistribution.values,
                          },
                        ],
                      }}
                      options={{
                        legend: { display: !isMediumViewPort },
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
                    {
                      versionsDistribution.others.length && !isMediumViewPort
                        ? <OthersTooltip title={t('Version')} data={versionsDistribution.others} />
                        : null
                    }
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
                        labels: heightDistribution.labels,
                        datasets: [
                          {
                            data: heightDistribution.values,
                          },
                        ],
                      }}
                      options={{
                        legend: { display: !isMediumViewPort },
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
                    {
                      heightDistribution.others.length && !isMediumViewPort
                        ? <OthersTooltip title={t('Height')} data={heightDistribution.others} />
                        : null
                    }
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
                        labels: [t('Connected'), t('Disconnected')],
                        datasets: [
                          {
                            label: 'delegates',
                            data: [basic.connectedPeers, basic.disconnectedPeers],
                          },
                        ],
                      }}
                      options={{
                        legend: { display: !isMediumViewPort },
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
      </BoxContent>
    </Box>
  );
};

export default withResizeValues(Overview);
