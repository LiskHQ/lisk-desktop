// istanbul ignore file
import React, { useState } from 'react';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import withData from '../../../../utils/withData';
import liskService from '../../../../utils/api/lsk/liskService';
import Box from '../../../toolbox/box';
import BoxTabs from '../../../toolbox/tabs';
import BoxHeader from '../../../toolbox/box/header';
import transactionTypes from '../../../../constants/transactionTypes';
import { DoughnutChart, BarChart } from '../../../toolbox/charts';
import { fromRawLsk } from '../../../../utils/lsk';
import { chartStyles } from '../../../../constants/chartConstants';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './overview.css';
import { kFormatter } from '../../../../utils/helpers';

const options = {
  responsive: true,
  scales: {
    yAxes: [{
      id: 'Number',
      type: 'linear',
      position: 'left',
      ticks: {
        fontColor: chartStyles.ultramarineBlue,
      },
      gridLines: false,
    }, {
      id: 'Volume',
      type: 'linear',
      position: 'left',
      ticks: {
        fontColor: chartStyles.ufoGreen,
      },
      gridLines: false,
    }],
    xAxes: {
      gridLines: false,
    },
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
    name: t('{{num}} month', { num: 6 }),
  },
  {
    value: 'year',
    name: t('{{num}} year', { num: 1 }),
  },
];

const formatNumberRange = (range) => {
  const [start, end] = range.split('_');
  return `${kFormatter(start)} < ${kFormatter(end)}`;
};

const Overview = ({ t, txStats }) => {
  const distributionByType = txStats.data.distributionByType;
  const distributionByAmount = txStats.data.distributionByAmount;
  const txCountList = txStats.data.timeline.map(item => item.transactionCount);
  const txVolumeList = txStats.data.timeline.map(item => fromRawLsk(item.volume));
  const txDateList = txStats.data.timeline.map(item => item.date.replace(/^\d{4}-/, ''));
  const [activeTab, setActiveTab] = useState('week');

  const changeTab = (tab) => {
    setActiveTab(tab.value);
    txStats.loadData({ period: tab.value });
  };

  return (
    <Box>
      <BoxHeader>
        <h2>{t('Overview')}</h2>
        <BoxTabs
          tabs={tabs(t)}
          active={activeTab}
          onClick={changeTab}
          className="box-tabs"
        />
      </BoxHeader>
      <div className={styles.container}>
        <div className={`${styles.column} ${styles.pie}`}>
          <h2 className={styles.title}>{t('Distribution of transaction types')}</h2>
          <div className={styles.graph}>
            <DoughnutChart
              data={{
                labels: transactionTypes
                  .getListOf('title')
                  .map(item => item
                    .replace('Second passphrase registration', '2nd passphrase reg.')
                    .replace('Multisignature creation', 'Multisig. creation')),
                datasets: [
                  {
                    data: Object.values(distributionByType),
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className={`${styles.column} ${styles.pie}`}>
          <h2 className={styles.title}>{t('Amount per transaction (LSK)')}</h2>
          <div className={styles.graph}>
            <DoughnutChart
              data={{
                labels: Object.keys(distributionByAmount).map(range => formatNumberRange(range)),
                datasets: [
                  {
                    data: Object.values(distributionByAmount),
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className={`${styles.column} ${styles.bar}`}>
          <h2 className={styles.title}>{t('Transactions number / volume (LSK)')}</h2>
          <div className={styles.graph}>
            <BarChart
              data={{
                labels: txDateList,
                datasets: [
                  {
                    label: 'Number',
                    yAxisID: 'Number',
                    data: txCountList,
                    categoryPercentage: 0.5,
                    barPercentage: 0.8,
                  },
                  {
                    label: 'Volume',
                    yAxisID: 'Volume',
                    data: txVolumeList,
                    categoryPercentage: 0.5,
                    barPercentage: 0.8,
                  },
                ],
              }}
              options={options}
            />
            <aside className={styles.legends}>
              <h5 className={`${styles.legend} ${styles.number}`}>
                <span>{t('Number')}</span>
                <Tooltip className={`${styles.tooltip} showOnLeft`}>
                  <p>{t('The number of transactions submitted on the given time period.')}</p>
                </Tooltip>
              </h5>
              <h5 className={`${styles.legend} ${styles.volume}`}>
                <span>{t('Volume')}</span>
                <Tooltip className={`${styles.tooltip} showOnLeft`}>
                  <p>{t('The aggregated of LSK volume transferred on the given time period.')}</p>
                </Tooltip>
              </h5>
            </aside>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default compose(
  withData(
    {
      txStats: {
        apiUtil: liskService.getTxStats,
        defaultData: {
          distributionByType: {},
          distributionByAmount: {},
          timeline: [],
        },
        autoload: true,
        defaultUrlSearchParams: { period: 'week' },
        transformResponse: response => response.data,
      },
    },
  ),
  withTranslation(),
)(Overview);
