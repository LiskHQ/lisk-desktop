// istanbul ignore file
import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import { DoughnutChart, LineChart } from '../../../toolbox/charts';
import NumericInfo from './numericInfo';
import styles from './overview.css';
import { fromRawLsk } from 'utils/lsk';
import GuideTooltip, { GuideTooltipItem } from '../../../toolbox/charts/guideTooltip';
import { colorPalette } from 'constants';

const Overview = ({
  chartActiveAndStandby,
  chartRegisteredDelegates,
  t,
  totalBlocks,
  supply,
}) => {
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
    const labels = chartRegisteredDelegates.data.map((item) => {
      const date = item.x;
      return date.slice(0, 2) + date.slice(3, date.length);
    });
    labels.push('Now');
    return labels;
  };

  const doughnutChartData = {
    labels: [t('Standby delegates'), t('Active delegates')],
    datasets: [
      {
        label: 'delegates',
        data: [Math.max(0, chartActiveAndStandby.data - 101), 101],
      },
    ],
  };

  const doughnutChartOptions = {
    tooltips: {
      callbacks: {
        title(tooltipItem, data) { return data.labels[tooltipItem[0].index]; },
        label(tooltipItem, data) {
          return data.datasets[0].data[tooltipItem.index];
        },
      },
    },
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Delegates overview')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {
            typeof chartActiveAndStandby.data === 'number'
              ? (
                <>
                  <div className={styles.chartBox}>
                    <h2 className={styles.title}>{t('Total')}</h2>
                    <div className={`${styles.chart} showOnLargeViewPort`}>
                      <DoughnutChart
                        data={doughnutChartData}
                        options={{
                          ...doughnutChartOptions,
                          legend: { display: true },
                        }}
                      />
                    </div>
                    <div className={`${styles.chart} hideOnLargeViewPort`}>
                      <DoughnutChart
                        data={doughnutChartData}
                        options={{
                          ...doughnutChartOptions,
                          legend: { display: false },
                        }}
                      />
                    </div>
                    <div className="hideOnLargeViewPort">
                      <GuideTooltip>
                        <GuideTooltipItem
                          color={colorPalette[0]}
                          label={t('Standby delegates')}
                        />
                        <GuideTooltipItem
                          color={colorPalette[1]}
                          label={t('Active delegates')}
                        />
                      </GuideTooltip>
                    </div>
                  </div>
                </>
              )
              : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
          }
        </div>
        <div className={styles.column}>
          <div className={styles.centered}>
            <h2 className={styles.title}>
              <span>{t('Forging totals')}</span>
            </h2>
            <div className={styles.list}>
              <NumericInfo
                title="Total blocks"
                value={totalBlocks}
                icon="totalBlocks"
              />
              <NumericInfo
                title="Total transactions"
                value="1272556"
                icon="transactionsMonitor"
              />
              <NumericInfo
                title="Total LSK"
                value={fromRawLsk(supply)}
                icon="distribution"
              />
            </div>
          </div>
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
