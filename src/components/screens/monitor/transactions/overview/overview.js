// istanbul ignore file
import React, { useState } from 'react';
import moment from 'moment';
import Box from '../../../../toolbox/box';
import BoxTabs from '../../../../toolbox/tabs';
import BoxHeader from '../../../../toolbox/box/header';
import BoxContent from '../../../../toolbox/box/content';
import transactionTypes from '../../../../../constants/transactionTypes';
import { DoughnutChart, BarChart } from '../../../../toolbox/charts';
import { fromRawLsk } from '../../../../../utils/lsk';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './overview.css';
import { kFormatter } from '../../../../../utils/helpers';
import GuideTooltip, { GuideTooltipItem } from '../../../../toolbox/charts/guideTooltip';
import { colorPalette, chartStyles } from '../../../../../constants/chartConstants';

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
    '0.001_0.01': '< 10',
    '0.01_0.1': '< 10',
    '0.1_1': '< 10',
    '1_10': '< 10',
    '10_100': '10 < 100',
    '100_1000': '100 < 1K',
    '1000_10000': '1K < 10K',
    '10000_100000': '10K <',
    '100000_1000000': '10K <',
    '1000000_10000000': '10K <',
    '10000000_100000000': '10K <',
    '100000000_1000000000': '10K <',
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

const formatDistributionByValues = distributions => [0, 1, 2, 3, 4].map(item =>
  (distributions[item] || 0) + (distributions[item + 8] || 0));

const Overview = ({ t, txStats }) => {
  const [activeTab, setActiveTab] = useState('week');
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
    labels: transactionTypes
      .getListOf('title')
      .map(item => item
        .replace('Second passphrase registration', '2nd passphrase reg.')
        .replace('Multisignature creation', 'Multisig. creation')),
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
          <h2 className={styles.title}>{t('Distribution of transaction types')}</h2>
          <div className={`${styles.graph} showOnLargeViewPort`}>
            <DoughnutChart data={distributionChartData} options={{ legend: { display: true } }} />
          </div>
          <div className={`${styles.graph} hideOnLargeViewPort`}>
            <DoughnutChart
              data={distributionChartData}
              options={{ legend: { display: false } }}
            />
          </div>
          <div className="hideOnLargeViewPort">
            <GuideTooltip>
              {transactionTypes
                .getListOf('title')
                .map((label, i) => (
                  <GuideTooltipItem
                    key={`transaction-GuideTooltip${i}`}
                    color={colorPalette[i]}
                    label={label
                      .replace('Second passphrase registration', '2nd passphrase reg.')
                      .replace('Multisignature creation', 'Multisig. creation')
                    }
                  />
                ))
                  }
            </GuideTooltip>
          </div>
        </div>
        <div className={`${styles.column} ${styles.pie}`}>
          <h2 className={styles.title}>{t('Amount per transaction (LSK)')}</h2>
          <div className={`${styles.graph} showOnLargeViewPort`}>
            <DoughnutChart data={amountChartData} options={{ legend: { display: true } }} />
          </div>
          <div className={`${styles.graph} hideOnLargeViewPort`}>
            <DoughnutChart data={amountChartData} options={{ legend: { display: false } }} />
          </div>
          <div className="hideOnLargeViewPort">
            <GuideTooltip>
              {Object.keys(distributionByAmount)
                .map((label, i) => (
                  <GuideTooltipItem key={`distribution-GuideTooltip${i}`} color={colorPalette[i]} label={label} />
                ))
              }
            </GuideTooltip>
          </div>
        </div>
        <div className={`${styles.column} ${styles.bar}`}>
          <div className={styles.top}>
            <h2 className={styles.title}>{t('Transactions number / volume (LSK)')}</h2>
            <aside className={styles.legends}>
              <h5 className={`${styles.legend} ${styles.volume}`}>
                <span>{t('Volume')}</span>
                <Tooltip className={styles.tooltip} position="left">
                  <p>{t('The aggregated LSK volume transferred on the given time period.')}</p>
                </Tooltip>
              </h5>
              <h5 className={`${styles.legend} ${styles.number}`}>
                <span>{t('Number')}</span>
                <Tooltip className={styles.tooltip} position="left">
                  <p>{t('The number of transactions submitted on the given time period.')}</p>
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
