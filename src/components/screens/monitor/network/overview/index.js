// istanbul ignore file
import React from 'react';
import { colorPalette } from '@constants';
import Box from '../../../../toolbox/box';
import BoxHeader from '../../../../toolbox/box/header';
import BoxContent from '../../../../toolbox/box/content';
import BoxEmptyState from '../../../../toolbox/box/emptyState';
import { DoughnutChart } from '../../../../toolbox/charts';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import OthersTooltip from './othersTooltip';
import styles from './overview.css';
import GuideTooltip, { GuideTooltipItem } from '../../../../toolbox/charts/guideTooltip';

const createChartData = (data, t) => {
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

const HeightDistributionChart = ({ t, heightDistribution }) => {
  const chartProps = heightDistribution ? {
    data: {
      labels: heightDistribution.labels,
      datasets: [
        {
          data: heightDistribution.values,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
          label(tooltipItem, data) {
            return data.datasets[0].data[tooltipItem.index];
          },
        },
      },
    },
  } : {};

  return (
    <>
      <div className={styles.column}>
        {
              heightDistribution
                ? (
                  <div className={styles.chartBox}>
                    <h2 className={styles.title}>{t('Height distribution')}</h2>
                    <div className={`${styles.chart} showOnLargeViewPort`}>
                      <DoughnutChart
                        data={chartProps.data}
                        options={{
                          ...chartProps.options,
                          legend: { display: true },
                        }}
                      />
                      {
                        heightDistribution.others.length && !false
                          ? <OthersTooltip title={t('Height')} data={heightDistribution.others} />
                          : null
                      }
                    </div>
                    <div className={`${styles.chart} hideOnLargeViewPort`}>
                      <DoughnutChart
                        data={chartProps.data}
                        options={{
                          ...chartProps.options,
                          legend: { display: false },
                        }}
                      />
                    </div>
                    <div className="hideOnLargeViewPort">
                      <GuideTooltip>
                        {
                          heightDistribution.labels
                            .map((label, i) => (
                              <GuideTooltipItem
                                key={`distribution-GuideTooltip-${i}-${label}`}
                                label={label}
                                color={colorPalette[i]}
                              />
                            ))}
                      </GuideTooltip>
                    </div>
                  </div>
                )
                : <BoxEmptyState><p>{t('No versions distribution information')}</p></BoxEmptyState>
            }
      </div>
    </>
  );
};

const PeersChart = ({ t, basic }) => {
  const chartProps = basic ? {
    data: {
      labels: [t('Connected'), t('Disconnected')],
      datasets: [
        {
          label: 'delegates',
          data: [basic.connectedPeers, basic.disconnectedPeers],
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
          label(tooltipItem, data) {
            return data.datasets[0].data[tooltipItem.index];
          },
        },
      },
    },
  } : {};

  return (
    <>
      <div className={styles.column}>
        {
          basic
            ? (
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Peers')}</h2>
                <div className={`${styles.chart} showOnLargeViewPort`}>
                  <DoughnutChart
                    data={chartProps.data}
                    options={{
                      ...chartProps.options,
                      legend: { display: true },
                    }}
                  />
                </div>
                <div className={`${styles.chart} hideOnLargeViewPort`}>
                  <DoughnutChart
                    data={chartProps.data}
                    options={{
                      ...chartProps.options,
                      legend: { display: false },
                    }}
                  />
                </div>
                <div className="hideOnLargeViewPort">
                  <GuideTooltip>
                    <GuideTooltipItem
                      label={t('Connected')}
                      color={colorPalette[0]}
                    />
                    <GuideTooltipItem
                      label={t('Disconnected')}
                      color={colorPalette[1]}
                    />
                  </GuideTooltip>
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No peers information')}</p></BoxEmptyState>
        }
      </div>
    </>
  );
};

const Overview = ({
  networkStatus,
  t,
}) => {
  const { basic, coreVer, height } = networkStatus;
  const versionsDistribution = coreVer ? createChartData(coreVer, t) : null;
  const heightDistribution = height ? createChartData(height, t) : null;
  const versionChartProps = versionsDistribution ? {
    data: {
      labels: versionsDistribution.labels,
      datasets: [
        {
          data: versionsDistribution.values,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
          label(tooltipItem, data) {
            return data.datasets[0].data[tooltipItem.index];
          },
        },
      },
    },
  } : {};

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
                  <div className={`${styles.chart} showOnLargeViewPort`}>
                    <DoughnutChart
                      data={versionChartProps.data}
                      options={{
                        ...versionChartProps.options,
                        legend: { display: true },
                      }}
                    />
                    {
                      versionsDistribution.others.length
                        ? <OthersTooltip title={t('Version')} data={versionsDistribution.others} />
                        : null
                    }
                  </div>
                  <div className={`${styles.chart} hideOnLargeViewPort`}>
                    <DoughnutChart
                      data={versionChartProps.data}
                      options={{
                        ...versionChartProps.options,
                        legend: { display: false },
                      }}
                    />
                  </div>
                  <div className="hideOnLargeViewPort">
                    <GuideTooltip>
                      {
                        versionsDistribution.labels
                          .map((label, i) => (
                            <GuideTooltipItem
                              key={`version-GuideTooltip-${i}-${label}`}
                              label={label}
                              color={colorPalette[i]}
                            />
                          ))}
                    </GuideTooltip>
                  </div>
                </div>
              )
              : <BoxEmptyState><p>{t('No height distribution information')}</p></BoxEmptyState>
          }
        </div>
        <HeightDistributionChart t={t} heightDistribution={heightDistribution} />
        <PeersChart t={t} basic={basic} />
      </BoxContent>
    </Box>
  );
};

export default Overview;
