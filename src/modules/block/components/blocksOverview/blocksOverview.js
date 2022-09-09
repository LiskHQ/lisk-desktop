import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { chartStyles } from 'src/modules/common/components/charts/chartConfig';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxTabs from 'src/theme/tabs';
import { DoughnutChart, BarChart } from 'src/modules/common/components/charts';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import { useBlocks } from '../../hooks/queries/useBlocks';
import styles from './blocksOverview.css';

const BlocksOverview = () => {
  const [activeTab, setActiveTab] = useState(10);
  const [config, setConfig] = useState({ params: {} });
  const { data: blocks } = useBlocks({ config });
  const { t } = useTranslation();

  const changeTab = ({ value }) => {
    setActiveTab(value);
    setConfig({ params: { limit: value } });
  };

  const tabs = [
    {
      value: 10,
      name: t('Last {{num}} blocks', { num: 10 }),
    },
    {
      value: 50,
      name: t('Last {{num}} blocks', { num: 50 }),
    },
    {
      value: 100,
      name: t('Last {{num}} blocks', { num: 100 }),
    },
  ];

  const doughnutChartData = {
    labels: [t('Empty'), t('Not empty')],
    datasets: [
      {
        backgroundColor: [chartStyles.mystic, chartStyles.ultramarineBlue],
        data: blocks?.data?.reduce(
          (acc, block) => {
            if (block.numberOfTransactions) acc[1]++;
            else acc[0]++;
            return acc;
          },
          [0, 0]
        ),
      },
    ],
  };

  const doughnutChartOptions = {
    cutoutPercentage: 65,
    tooltips: {
      callbacks: {
        // istanbul ignore next
        title(tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
        // istanbul ignore next
        label(tooltipItem, data) {
          return t('{{ blocks }} Blocks', {
            blocks: data.datasets[0].data[tooltipItem.index],
          });
        },
      },
    },
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader className="box-header">
        <h2>{t('Blocks overview')}</h2>
        <BoxTabs tabs={tabs} active={activeTab} onClick={changeTab} className="box-tabs" />
      </BoxHeader>
      <BoxContent>
        <div className={`${grid.row} ${styles.row}`}>
          <div
            className={`${grid['col-sm-8']} ${grid['col-xs-7']} ${styles.chartBox} ${styles.barChartContainer}`}
          >
            <h2 className={styles.chartTitle}>{t('Transactions per block')}</h2>
            <div className={styles.chart}>
              <BarChart
                data={{
                  labels: blocks?.data?.map((block) => block.id),
                  datasets: [
                    {
                      label: t('block'),
                      data: blocks?.data?.map((block) => block.numberOfTransactions),
                      backgroundColor: chartStyles.ultramarineBlue,
                    },
                  ],
                }}
                options={{
                  legend: {
                    display: false,
                  },
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      bottom: 0,
                    },
                  },
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          offsetGridLines: true,
                          lineWidth: 0,
                        },
                        ticks: {
                          display: false,
                          gridLines: {
                            drawTicks: false,
                          },
                        },
                        scaleLabel: {
                          display: true,
                          labelString: t('Last {{num}} blocks', {
                            num: activeTab,
                          }),
                          lineHeight: 2,
                          fontSize: chartStyles.fontSize,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          offsetGridLines: false,
                          lineWidth: 0,
                          zeroLineWidth: 1,
                          drawTicks: false,
                        },
                        ticks: {
                          padding: 15,
                          fontSize: chartStyles.fontSize,
                        },
                      },
                    ],
                  },
                  tooltips: {
                    callbacks: {
                      // istanbul ignore next
                      title(tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                      },
                      // istanbul ignore next
                      label(tooltipItem, data) {
                        return t('{{transactions}} transactions', {
                          transactions: data.datasets[0].data[tooltipItem.index],
                        });
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div
            className={`${grid['col-sm-4']} ${grid['col-xs-5']} ${styles.chartBox} ${styles.doughnutChartContainer}`}
          >
            <h2 className={styles.chartTitle}>{t('Empty/Not empty')}</h2>
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
                <GuideTooltipItem color={chartStyles.mystic} label={t('Empty')} />
                <GuideTooltipItem color={chartStyles.ultramarineBlue} label={t('Not empty')} />
              </GuideTooltip>
            </div>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default BlocksOverview;
