/* eslint-disable max-lines */
// istanbul ignore file
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import Empty from 'src/theme/table/empty';
import { DoughnutChart } from 'src/modules/common/components/charts';
import Tooltip from 'src/theme/Tooltip';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import OthersTooltip from './othersTooltip';
import styles from './statistics.css';
import { useNetworkStatistics } from '../../hooks/queries';

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
    .map((item) => item[0]);
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
  const chartProps = versionData
    ? {
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
              title(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
              },
              label(tooltipItem, data) {
                return data.datasets[0].data[tooltipItem.index];
              },
            },
          },
        },
      }
    : {};

  return (
    <div className={styles.column}>
      {versionData ? (
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
            {versionData.others.length ? (
              <OthersTooltip title={t('Version')} data={versionData.others} />
            ) : null}
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
              {versionData.labels.map((label, i) => (
                <GuideTooltipItem
                  key={`version-GuideTooltip-${i}-${label}`}
                  label={label}
                  color={colorPalette[i]}
                />
              ))}
            </GuideTooltip>
          </div>
        </div>
      ) : (
        <BoxEmptyState>
          <p>{t('No version information')}</p>
        </BoxEmptyState>
      )}
    </div>
  );
};

const HeightsDonutChart = ({ t, heightData, colorPalette }) => {
  const chartProps = heightData
    ? {
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
              title(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
              },
              label(tooltipItem, data) {
                return data.datasets[0].data[tooltipItem.index];
              },
            },
          },
        },
      }
    : {};

  return (
    <div className={styles.column}>
      {heightData ? (
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
            {heightData.others.length && true ? (
              <OthersTooltip title={t('Height')} data={heightData.others} />
            ) : null}
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
              {heightData.labels.map((label, i) => (
                <GuideTooltipItem
                  key={`distribution-GuideTooltip-${i}-${label}`}
                  label={label}
                  color={colorPalette[i]}
                />
              ))}
            </GuideTooltip>
          </div>
        </div>
      ) : (
        <BoxEmptyState>
          <p>{t('No height information')}</p>
        </BoxEmptyState>
      )}
    </div>
  );
};

const ConnectivityDonutChart = ({ t, connectionData, colorPalette }) => {
  const chartProps = connectionData
    ? {
        data: {
          labels: [t('Connected'), t('Disconnected')],
          datasets: [
            {
              label: 'validators',
              data: [connectionData.connectedPeers, connectionData.disconnectedPeers],
            },
          ],
        },
        options: {
          tooltips: {
            callbacks: {
              title(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
              },
              label(tooltipItem, data) {
                return data.datasets[0].data[tooltipItem.index];
              },
            },
          },
        },
      }
    : {};

  return (
    <>
      <div className={styles.column}>
        {connectionData ? (
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
                <GuideTooltipItem label={t('Connected')} color={colorPalette[0]} />
                <GuideTooltipItem label={t('Disconnected')} color={colorPalette[1]} />
              </GuideTooltip>
            </div>
          </div>
        ) : (
          <BoxEmptyState>
            <p>{t('No connectivity information')}</p>
          </BoxEmptyState>
        )}
      </div>
    </>
  );
};

const ChartsWithData = ({ networkVersion, height, basic, t }) => {
  if (!networkVersion) {
    return null; // @todo Create placeholder
  }

  const versionData = createChartData(networkVersion, t);
  const heightData = createChartData(height, t);
  const colorPalette = getColorPalette(useTheme());

  return (
    <>
      <VersionsDonutChart t={t} versionData={versionData} colorPalette={colorPalette} />
      <HeightsDonutChart t={t} heightData={heightData} colorPalette={colorPalette} />
      <ConnectivityDonutChart t={t} connectionData={basic} colorPalette={colorPalette} />
    </>
  );
};

const Statistics = () => {
  const { t } = useTranslation();
  const { data: networkStatistics, isLoading } = useNetworkStatistics();

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <div>
          <h5 className={styles.boxHeading}>{t('Network statistics')}</h5>
          <Tooltip position="bottom right" indent>
            <p>
              {t(
                'The statistics shown only reflects peers connected to the current Lisk Service node.'
              )}
            </p>
          </Tooltip>
        </div>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <ChartsWithData {...networkStatistics?.data} t={t} />
        <Empty
          data={{ illustration: 'emptyNetworkStatisticsIllustration' }}
          isLoading={isLoading}
          isListEmpty={(networkStatistics?.data || []).length === 0}
          className={styles.emptyState}
        />
      </BoxContent>
    </Box>
  );
};

export default Statistics;
