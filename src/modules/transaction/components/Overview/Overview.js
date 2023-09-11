/* eslint-disable max-lines, max-statements */
// istanbul ignore file
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import { kFormatter } from 'src/utils/helpers';
import { chartStyles } from 'src/modules/common/components/charts/chartConfig';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { getModuleCommandTitle } from '@transaction/utils/moduleCommand';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries';
import { useTheme } from '@theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import Box from '@theme/box';
import BoxTabs from '@theme/tabs';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import { DoughnutChart, BarChart } from 'src/modules/common/components/charts';
import Tooltip from '@theme/Tooltip';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import { useTransactionStatistics } from '../../hooks/queries';
import { normalizeTransactionsStatisticsParams, normalizeNumberRange } from '../../utils';
import styles from './Overview.css';

const moduleCommands = Object.values(MODULE_COMMANDS_NAME_MAP);
const titles = getModuleCommandTitle();
const listOfLabels = moduleCommands.map((id) => titles[id]);

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
    yAxes: [
      {
        id: 'Number',
        type: 'linear',
        position: 'left',
        ticks: {
          fontColor: chartStyles.ultramarineBlue,
          fontSize: chartStyles.fontSize,
          callback: (value) => kFormatter(value),
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
          callback: (value) => kFormatter(value),
        },
        gridLines: false,
      },
    ],
    xAxes: [
      {
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
      },
    ],
  },
  legend: {
    display: false,
  },
};

const tabs = (t = (str) => str) => [
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

const formatDates = (date, period) => {
  if (period === 'week') {
    return moment(date).format('ddd');
  }
  if (period === 'month') {
    return moment(date).format('MMM');
  }
  return date.replace(/^\d{4}-/, '');
};

const formatDistributionByValues = (distributions) =>
  moduleCommands.map((id) => (distributions[id] ? parseInt(distributions[id], 10) : 0));

const Overview = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({ limit: 7, interval: 'day' });
  const [activeTab, setActiveTab] = useState('week');
  const colorPalette = getColorPalette(useTheme());
  const { data: tokenData } = useAppsMetaTokens();
  const token = tokenData?.data?.[0];

  const { data: txStatsData } = useTransactionStatistics({ config: { params } });
  const txStats = txStatsData?.data ?? {
    distributionByType: {},
    distributionByAmount: {},
    timeline: {},
  };

  const distributionByType = formatDistributionByValues(txStats.distributionByType);
  const distributionByAmount = normalizeNumberRange(
    txStats.distributionByAmount?.[token?.tokenID] ?? {}
  );
  const { txCountList, txVolumeList, txDateList } =
    Object.keys(txStats.timeline).length > 0 && txStats.timeline[token?.tokenID]
      ? txStats.timeline[token?.tokenID].reduce(
          (acc, item) => ({
            txCountList: [...acc.txCountList, item.transactionCount],
            txDateList: [...acc.txDateList, formatDates(item.date, activeTab).slice(0, 2)],
            txVolumeList: [...acc.txVolumeList, convertFromBaseDenom(item.volume, token)],
          }),
          {
            txCountList: [],
            txDateList: [],
            txVolumeList: [],
          }
        )
      : {
          txCountList: [],
          txVolumeList: [],
          txDateList: [],
        };

  const changeTab = (tab) => {
    setActiveTab(tab.value);
    setParams(normalizeTransactionsStatisticsParams(tab.value));
  };

  const distributionChartData = {
    labels: listOfLabels.map((item) =>
      item?.replace('Register multisignature group', 'Regsiter multisig.')
    ),
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
          <div className={styles.graph}>
            <div>
              <GuideTooltip>
                {listOfLabels.map((label, i) => (
                  <GuideTooltipItem
                    key={`transaction-GuideTooltip${i}`}
                    color={colorPalette[i]}
                    label={label?.replace('Register multisignature group', 'Register multisig.')}
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
          <h2 className={styles.title}>{t(`Amount per transaction (${token?.symbol})`)}</h2>
          <div className={styles.graph}>
            <div>
              <GuideTooltip>
                {Object.keys(distributionByAmount).map((label, i) => (
                  <GuideTooltipItem
                    key={`distribution-GuideTooltip${i}`}
                    color={colorPalette[i]}
                    label={label}
                  />
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
            <h2 className={styles.title}>{t(`Number of transactions / Volume (${token?.symbol})`)}</h2>
            <aside className={styles.legends}>
              <h5 className={`${styles.legend} ${styles.volume}`}>
                <span>{t('Volume')}</span>
                <Tooltip className={styles.tooltip} position="left">
                  <p>{t(`The aggregated ${token?.symbol} volume transferred over the selected time period.`)}</p>
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
