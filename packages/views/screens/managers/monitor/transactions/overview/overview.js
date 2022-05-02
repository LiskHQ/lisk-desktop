/* eslint-disable max-lines */
// istanbul ignore file
import React, { useState } from 'react';
import moment from 'moment';
import { fromRawLsk } from '@token/utilities/lsk';
import { kFormatter } from '@common/utilities/helpers';
import { chartStyles } from '@common/configuration';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { getModuleAssetTitle } from '@transaction/utils/moduleAssets';
import { useTheme } from '@views/utilities/theme';
import { getColorPalette } from '@views/basics/charts/chartOptions';
import Box from '@basics/box';
import BoxTabs from '@basics/tabs';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import { DoughnutChart, BarChart } from '@basics/charts';
import Tooltip from '@basics/tooltip/tooltip';
import GuideTooltip, { GuideTooltipItem } from '@basics/charts/guideTooltip';
import styles from './overview.css';

const moduleAssetIds = Object.values(MODULE_ASSETS_NAME_ID_MAP);
const titles = getModuleAssetTitle();
const listOfLabels = moduleAssetIds.map(id => titles[id]);

const options = {
  responsive: true,
  layout: {
    padding: {
      left: 0,
      right: 0,
      bottom: 0,
    },
  },
  scales: {
    yAxes: [{
      id: 'Number',
      type: 'linear',
      position: 'left',
      ticks: {
        fontColor: chartStyles.ultramarineBlue,
        fontSize: chartStyles.fontSize,
        callback: value => kFormatter(value),
        gridLines: {
          drawTicks: false,
        },
        padding: 15,
      },
      gridLines: {
        display: true,
        offsetGridLines: false,
        lineWidth: 0,
        zeroLineWidth: 1,
        drawTicks: false,
      },
    },
    {
      id: 'Volume',
      type: 'linear',
      position: 'left',
      ticks: {
        fontColor: chartStyles.ufoGreen,
        callback: value => kFormatter(value),
      },
      gridLines: false,
    }],
    xAxes: [{
      gridLines: {
        display: true,
        offsetGridLines: true,
        lineWidth: 0,
      },
      ticks: {
        display: true,
        gridLines: {
          drawTicks: false,
        },
      },
    }],
  },
  legend: {
    display: false,
  },
};

const tabs = (t = str => str) => [
  {
    value: 'week',
    name: t('{{num}} week', { num: 1 }),
  },
  {
    value: 'month',
    name: t('{{num}} months', { num: 6 }),
  },
  {
    value: 'year',
    name: t('{{num}} year', { num: 1 }),
  },
];

const normalizeNumberRange = (distributions) => {
  const values = {
    '0.001_0.01': '0 - 10 LSK',
    '0.01_0.1': '0 - 10 LSK',
    '0.1_1': '0 - 10 LSK',
    '1_10': '0 - 10 LSK',
    '10_100': '11 - 100 LSK',
    '100_1000': '101 - 1000 LSK',
    '1000_10000': '1001 - 10,000 LSK',
    '10000_100000': '10,001 - 100,000 LSK',
    '100000_1000000': '100,001 - 1,000,000 LSK',
    '1000000_10000000': '1,000,001 - 10,000,000 LSK',
    '10000000_100000000': '10,000,001 - 100,000,000 LSK',
    '100000000_1000000000': '100,000,001 - 1,000,000,000 LSK',
  };
  return Object.keys(distributions).reduce((acc, item) => {
    acc[values[item]] = (acc[values[item]] || 0) + distributions[item];
    return acc;
  }, {});
};

const formatDates = (date, period) => {
  if (period === 'week') {
    return moment(date).format('ddd');
  }
  if (period === 'month') {
    return moment(date).format('MMM');
  }
  return date.replace(/^\d{4}-/, '');
};

const formatDistributionByValues = distributions =>
  moduleAssetIds.map(id => (distributions[id] ? parseInt(distributions[id], 10) : 0));

const Overview = ({ t, txStats }) => {
  const [activeTab, setActiveTab] = useState('week');
  const colorPalette = getColorPalette(useTheme());
  const distributionByType = formatDistributionByValues(txStats.data.distributionByType);
  const distributionByAmount = normalizeNumberRange(txStats.data.distributionByAmount);
  const { txCountList, txVolumeList, txDateList } = txStats.data.timeline.reduce((acc, item) => ({
    txCountList: [...acc.txCountList, item.transactionCount],
    txDateList: [...acc.txDateList, formatDates(item.date, activeTab).slice(0, 2)],
    txVolumeList: [...acc.txVolumeList, fromRawLsk(item.volume)],
  }), {
    txCountList: [],
    txDateList: [],
    txVolumeList: [],
  });

  const changeTab = (tab) => {
    setActiveTab(tab.value);
    txStats.loadData({ period: tab.value });
  };

  const distributionChartData = {
    labels: listOfLabels
      .map(item => item
        .replace('Register multisignature group', 'Regsiter multisig.')),
    datasets: [
      {
        data: distributionByType,
      },
    ],
  };

  const amountChartData = {
    labels: Object.keys(distributionByAmount),
    datasets: [
      {
        data: Object.values(distributionByAmount),
      },
    ],
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h2>{t('Transactions overview')}</h2>
        <BoxTabs
          tabs={tabs(t)}
          active={activeTab}
          onClick={changeTab}
          className={`box-tabs ${styles.tabs}`}
        />
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={`${styles.column} ${styles.pie}`}>
          <h2 className={styles.title}>{t('Transaction types')}</h2>
          <div className={styles.graph}>
            <div>
              <GuideTooltip>
                {listOfLabels
                  .map((label, i) => (
                    <GuideTooltipItem
                      key={`transaction-GuideTooltip${i}`}
                      color={colorPalette[i]}
                      label={label
                        .replace('Register multisignature group', 'Register multisig.')}
                    />
                  ))}
              </GuideTooltip>
            </div>
            <div>
              <DoughnutChart
                data={distributionChartData}
                options={{
                  legend: { display: false },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: 0,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.pie}`}>
          <h2 className={styles.title}>{t('Amount per transaction (LSK)')}</h2>
          <div className={styles.graph}>
            <div>
              <GuideTooltip>
                {Object.keys(distributionByAmount)
                  .map((label, i) => (
                    <GuideTooltipItem key={`distribution-GuideTooltip${i}`} color={colorPalette[i]} label={label} />
                  ))}
              </GuideTooltip>
            </div>
            <div>
              <DoughnutChart
                data={amountChartData}
                options={{
                  legend: { display: false },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: 0,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.bar}`}>
          <div className={styles.top}>
            <h2 className={styles.title}>{t('Transaction volume / number (LSK)')}</h2>
            <aside className={styles.legends}>
              <h5 className={`${styles.legend} ${styles.volume}`}>
                <span>{t('Volume')}</span>
                <Tooltip className={styles.tooltip} position="left">
                  <p>{t('The aggregated LSK volume transferred over the selected time period.')}</p>
                </Tooltip>
              </h5>
              <h5 className={`${styles.legend} ${styles.number}`}>
                <span>{t('Number')}</span>
                <Tooltip className={styles.tooltip} position="left">
                  <p>{t('The number of transactions submitted over the selected time period.')}</p>
                </Tooltip>
              </h5>
            </aside>
          </div>
          <div className={styles.graph}>
            <BarChart
              data={{
                labels: txDateList.reverse(),
                datasets: [
                  {
                    label: 'Number',
                    yAxisID: 'Number',
                    data: txCountList.reverse(),
                    categoryPercentage: 0.5,
                    barPercentage: 0.8,
                    backgroundColor: chartStyles.ultramarineBlue,
                  },
                  {
                    label: 'Volume',
                    yAxisID: 'Volume',
                    data: txVolumeList.reverse(),
                    categoryPercentage: 0.5,
                    barPercentage: 0.8,
                    backgroundColor: chartStyles.ufoGreen,
                  },
                ],
              }}
              options={options}
            />
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default Overview;
