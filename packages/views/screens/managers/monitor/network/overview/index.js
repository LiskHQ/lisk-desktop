// istanbul ignore file
import React from 'react';
import { useTheme } from '@views/contexts/theme';
import { getColorPalette } from '@common/utilities/chartOptions';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import BoxEmptyState from '@basics/box/emptyState';
import { DoughnutChart } from '@basics/charts';
import Tooltip from '@basics/tooltip/tooltip';
import GuideTooltip, { GuideTooltipItem } from '@basics/charts/guideTooltip';
import OthersTooltip from './othersTooltip';
import styles from './overview.css';

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

const VersionsDonutChart = ({ t, versionData, colorPalette }) => {
  const chartProps = versionData ? {
    data: {
      labels: versionData.labels,
      datasets: [
        {
          data: versionData.values,
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
          versionData
            ? (
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Peer versions')}</h2>
                <div className={`${styles.chart} showOnLargeViewPort`}>
                  <DoughnutChart
                    data={chartProps.data}
                    options={{
                      ...chartProps.options,
                      legend: { display: true },
                    }}
                  />
                  {
                    versionData.others.length
                      ? <OthersTooltip title={t('Version')} data={versionData.others} />
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
                      versionData.labels
                        .map((label, i) => (
                          <GuideTooltipItem
                            key={`version-GuideTooltip-${i}-${label}`}
                            label={label}
                            color={colorPalette[i]}
                          />
                        ))
                    }
                  </GuideTooltip>
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No version information')}</p></BoxEmptyState>
        }
      </div>
    </>
  );
};

const HeightsDonutChart = ({ t, heightData, colorPalette }) => {
  const chartProps = heightData ? {
    data: {
      labels: heightData.labels,
      datasets: [
        {
          data: heightData.values,
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
          heightData
            ? (
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Peer heights')}</h2>
                <div className={`${styles.chart} showOnLargeViewPort`}>
                  <DoughnutChart
                    data={chartProps.data}
                    options={{
                      ...chartProps.options,
                      legend: { display: true },
                    }}
                  />
                  {
                    heightData.others.length && !false
                      ? <OthersTooltip title={t('Height')} data={heightData.others} />
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
                      heightData.labels
                        .map((label, i) => (
                          <GuideTooltipItem
                            key={`distribution-GuideTooltip-${i}-${label}`}
                            label={label}
                            color={colorPalette[i]}
                          />
                        ))
                    }
                  </GuideTooltip>
                </div>
              </div>
            )
            : <BoxEmptyState><p>{t('No height information')}</p></BoxEmptyState>
        }
      </div>
    </>
  );
};

const ConnectivityDonutChart = ({ t, connectionData, colorPalette }) => {
  const chartProps = connectionData ? {
    data: {
      labels: [t('Connected'), t('Disconnected')],
      datasets: [
        {
          label: 'delegates',
          data: [connectionData.connectedPeers, connectionData.disconnectedPeers],
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
          connectionData
            ? (
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Peer connectivity')}</h2>
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
            : <BoxEmptyState><p>{t('No connectivity information')}</p></BoxEmptyState>
        }
      </div>
    </>
  );
};

const Overview = ({
  networkStatus,
  t,
}) => {
  const { networkVersion, height, basic } = networkStatus;
  const versionData = networkVersion ? createChartData(networkVersion, t) : null;
  const heightData = height ? createChartData(height, t) : null;
  const colorPalette = getColorPalette(useTheme());

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <div>
          <h1 className={styles.boxHeading}>
            {t('Network statistics')}
          </h1>
          <Tooltip position="bottom right" indent>
            <p>{t('The statistics shown only reflects peers connected to the current Lisk Service node.')}</p>
          </Tooltip>
        </div>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <VersionsDonutChart t={t} versionData={versionData} colorPalette={colorPalette} />
        <HeightsDonutChart t={t} heightData={heightData} colorPalette={colorPalette} />
        <ConnectivityDonutChart t={t} connectionData={basic} colorPalette={colorPalette} />
      </BoxContent>
    </Box>
  );
};

export default Overview;
