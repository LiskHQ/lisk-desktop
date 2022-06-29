import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { DoughnutChart } from 'src/modules/common/components/charts';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { tokenMap } from '@token/fungible/consts/tokens';
import Tooltip from 'src/theme/Tooltip';
import Icon from 'src/theme/Icon';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import styles from './blockchainApplicationStatistics.css';

const BlockchainApplicationStatistics = ({ apps, statistics }) => {
  const { t } = useTranslation();
  const colorPalette = getColorPalette(useTheme());

  const doughnutChartData = {
    labels: [
      t('Registered'),
      t('Active'),
      t('Terminated'),
    ],
    datasets: [
      {
        backgroundColor: [colorPalette[1], colorPalette[0], colorPalette[2]],
        data: apps.data.reduce((acc, stats) => {
          switch (stats.status) {
            case 'registered':
              acc[0]++;
              break;
            case 'active':
              acc[1]++;
              break;
            case 'terminated':
              acc[2]++;
              break;
            // istanbul ignore next
            default:
              break;
          }
          return acc;
        }, [0, 0, 0]),
      },
    ],
  };

  return (
    <Box className={styles.container}>
      <BoxHeader>
        <h1>{t('Statistics')}</h1>
      </BoxHeader>
      <BoxContent className={styles.chartBox}>
        <DoughnutChart
          data={doughnutChartData}
          options={{
            cutoutPercentage: 70,
            legend: {
              display: true,
              position: 'left',
              align: 'start',
              labels: {
                padding: 20,
              },
            },
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
      </BoxContent>
      <BoxContent className={styles.statsBox}>
        <div>
          <div>
            <span className={styles.statsInfoTitle}>{t('Total Supply')}</span>
            <Tooltip size="m" position="bottom">
              <p>{t('Total LSK tokens in circulation')}</p>
            </Tooltip>
          </div>
          <p className={`${styles.statsInfo} total-supply-token`}>
            <TokenAmount
              val={statistics.data.totalSupplyLSK}
              token={tokenMap.LSK.key}
            />
          </p>
        </div>
        <div>
          <Icon name="totalSupplyToken" />
        </div>
      </BoxContent>
      <BoxContent className={styles.statsBox}>
        <div>
          <div>
            <span className={styles.statsInfoTitle}>{t('Staked')}</span>
            <Tooltip size="m" position="bottom">
              <p>{t('Amount of LSK tokens staked by validators and nominators for DPoS governance')}</p>
            </Tooltip>
          </div>
          <p className={`${styles.statsInfo} stacked-token`}>
            <TokenAmount
              val={statistics.data.stakedLSK}
              token={tokenMap.LSK.key}
            />
          </p>
        </div>
        <div>
          <Icon name="stackedToken" />
        </div>
      </BoxContent>
    </Box>
  );
};

export default BlockchainApplicationStatistics;
