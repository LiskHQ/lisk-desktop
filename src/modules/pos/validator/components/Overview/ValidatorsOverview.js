// istanbul ignore file
import React from 'react';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import { useTransactions } from 'src/modules/transaction/hooks/queries';
import { DoughnutChart } from 'src/modules/common/components/charts';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import { useValidators, useGenerators } from '../../hooks/queries';
import NumericInfo from './NumericInfo';
import Registrations from './Registrations';
import styles from './Overview.css';

const Overview = ({ totalBlocks, t }) => {
  const colorPalette = getColorPalette(useTheme());
  const { data: validators } = useValidators({ config: { params: { limit: 1 } } });
  const { data: generatorsData } = useGenerators({ config: { params: { limit: 103 } } });
  const { data: transactions } = useTransactions({ config: { params: { limit: 1 } } });
  const validatorsCount = validators?.meta.total ?? 0;
  const generatorsCount = generatorsData?.meta.total ?? 0;
  const transactionsCount = transactions?.meta.total ?? 0;
  const doughnutChartData = {
    labels: [t('Active validators'), t('Standby validators')],
    datasets: [
      {
        label: 'validators',
        data: [generatorsCount, validatorsCount - generatorsCount],
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
          {typeof validatorsCount === 'number' ? (
            <>
              <div className={styles.chartBox}>
                <h2 className={styles.title}>{t('Total validators')}</h2>
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
                    <GuideTooltipItem color={colorPalette[0]} label={t('Active validators')} />
                    <GuideTooltipItem color={colorPalette[1]} label={t('Standby validators')} />
                  </GuideTooltip>
                </div>
              </div>
            </>
          ) : (
            <BoxEmptyState>
              <p>{t('No validators information')}</p>
            </BoxEmptyState>
          )}
        </div>
        <div className={styles.column}>
          <div className={styles.centered}>
            <h2 className={styles.title}>
              <span>{t('Network stats')}</span>
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
          <Registrations />
        </div>
      </BoxContent>
    </Box>
  );
};

export default Overview;
