// istanbul ignore file
import React from 'react';
import { ROUND_LENGTH } from '@pos/validator/consts';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { DoughnutChart, LineChart } from 'src/modules/common/components/charts';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import { useValidators } from '../../hooks/queries';
import NumericInfo from './numericInfo';
import styles from './overview.css';

const getAmountOfDelegatesInTime = (registrations) => registrations.data.map((item) => item[1]);
const getAmountOfDelegatesLabels = (registrations) => registrations.data.map((item) => item[0]);

const Overview = ({ registrations, totalBlocks, t }) => {
  const colorPalette = getColorPalette(useTheme());
  const { data: delegates } = useValidators({ config: { params: { limit: 1 } } });
  const { data: transactions } = useTransactions({ config: { params: { limit: 1 } } });
  const delegatesCount = delegates?.meta.total ?? 0;
  const transactionsCount = transactions?.meta.total ?? 0;
  const doughnutChartData = {
    labels: [t('Standby delegates'), t('Active delegates')],
    datasets: [
      {
        label: 'delegates',
        data: [Math.max(0, delegatesCount - ROUND_LENGTH), ROUND_LENGTH],
      },
    ],
  };

  const doughnutChartOptions = {
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
  };

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {typeof delegatesCount === 'number' ? (
            <>
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Total')}</h2>
                <div
                  className={`${styles.chart} ${styles.showOnLargeViewPort} showOnLargeViewPort`}
                >
                  <DoughnutChart
                    data={doughnutChartData}
                    options={{
                      ...doughnutChartOptions,
                      cutoutPercentage: 70,
                      legend: { display: true },
                    }}
                  />
                </div>
                <div className={`${styles.chart} hideOnLargeViewPort`}>
                  <DoughnutChart
                    data={doughnutChartData}
                    options={{
                      ...doughnutChartOptions,
                      cutoutPercentage: 70,
                      legend: { display: false },
                    }}
                  />
                </div>
                <div className="hideOnLargeViewPort">
                  <GuideTooltip>
                    <GuideTooltipItem color={colorPalette[0]} label={t('Standby delegates')} />
                    <GuideTooltipItem color={colorPalette[1]} label={t('Active delegates')} />
                  </GuideTooltip>
                </div>
              </div>
            </>
          ) : (
            <BoxEmptyState>
              <p>{t('No delegates information')}</p>
            </BoxEmptyState>
          )}
        </div>
        <div className={styles.column}>
          <div className={styles.centered}>
            <h2 className={styles.title}>
              <span>{t('Forging totals')}</span>
            </h2>
            <div className={styles.list}>
              <NumericInfo title="Total blocks" value={totalBlocks} icon="totalBlocks" />
              <NumericInfo
                title="Total transactions"
                value={transactionsCount}
                icon="transactions"
              />
            </div>
          </div>
        </div>
        <div className={styles.column}>
          {registrations.data.length ? (
            <div className={styles.chartBox}>
              <h2 className={styles.title}>{t('Registered delegates')}</h2>
              <div className={styles.chart}>
                <LineChart
                  data={{
                    labels: getAmountOfDelegatesLabels(registrations),
                    datasets: [
                      {
                        data: getAmountOfDelegatesInTime(registrations),
                        pointStyle: 'line',
                      },
                    ],
                  }}
                  options={{ legend: { display: false } }}
                />
              </div>
            </div>
          ) : (
            <BoxEmptyState>
              <p>{t('No delegates information')}</p>
            </BoxEmptyState>
          )}
        </div>
      </BoxContent>
    </Box>
  );
};

export default Overview;
