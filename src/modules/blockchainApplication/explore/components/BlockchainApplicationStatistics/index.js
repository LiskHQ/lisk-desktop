import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toRawLsk } from '@token/fungible/utils/lsk';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { DoughnutChart } from 'src/modules/common/components/charts';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import GuideTooltip, {
  GuideTooltipItem,
} from 'src/modules/common/components/charts/guideTooltip';
import prepareChartDataAndOptions from '../../utils/prepareChartDataAndOptions';
import styles from './blockchainApplicationStatistics.css';

const BlockchainApplicationStatistics = ({ statistics }) => {
  const { t } = useTranslation();
  const colorPalette = getColorPalette(useTheme());
  const {
    doughnutChartData, doughnutChartOptions,
  } = prepareChartDataAndOptions(statistics.data, colorPalette, t);

  const cardsMap = useMemo(() => [
    {
      title: t('Total Supply'),
      description: t('Total LSK tokens in circulation'),
      amount: toRawLsk(statistics.data.totalSupplyLSK),
      icon: 'stackedToken',
    },
    {
      title: t('Staked'),
      description: t('Amount of LSK tokens staked by validators and nominators for DPoS governance'),
      amount: toRawLsk(statistics.data.stakedLSK),
      icon: 'totalSupplyToken',
    },
  ], [statistics]);

  return (
    <Box className={styles.container}>
      <BoxHeader>
        <h1>{t('Statistics')}</h1>
      </BoxHeader>
      <BoxContent className={styles.chartBox}>
        <div className={`${styles.chart} showOnLargeViewPort`}>
          <DoughnutChart
            data={doughnutChartData}
            options={doughnutChartOptions.largeViewport}
          />
        </div>
        <div className={`${styles.chart} hideOnLargeViewPort`}>
          <DoughnutChart
            data={doughnutChartData}
            options={doughnutChartOptions.mediumViewport}
          />
        </div>
        <div className={`${styles.chartGuides} hideOnLargeViewPort`}>
          <GuideTooltip>
            {doughnutChartData.labels.map((label, i) => (
              <GuideTooltipItem
                key={`blockchain-app-statistic-GuideTooltip-${i}-${label}`}
                label={label}
                color={doughnutChartData.datasets[0].backgroundColor[i]}
              />
            ))}
          </GuideTooltip>
        </div>
      </BoxContent>
      {cardsMap.map(({
        title, description, amount, icon,
      }) => (
        <BoxContent
          key={`app-stats-card-${icon}`}
          className={styles.statsBox}
        >
          <div>
            <div>
              <span className={styles.statsInfoTitle}>{title}</span>
              <Tooltip size="m" position="left">
                <p>{description}</p>
              </Tooltip>
            </div>
            <p className={`${styles.statsInfo} stats-info-value`}>
              <TokenAmount token="LSK" val={amount} />
            </p>
          </div>
          <div>
            <Icon name={icon} />
          </div>
        </BoxContent>
      ))}
    </Box>
  );
};

export default BlockchainApplicationStatistics;
