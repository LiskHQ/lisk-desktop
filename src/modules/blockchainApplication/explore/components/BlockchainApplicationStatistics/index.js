import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { DoughnutChart } from 'src/modules/common/components/charts';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { tokenMap } from '@token/fungible/consts/tokens';
import Tooltip from 'src/theme/Tooltip';
import styles from './blockchainApplicationStatistics.css';

const BlockchainApplicationStatistics = ({ apps, statistics }) => {
  const { t } = useTranslation();

  const doughnutChartData = {
    labels: [
      t('Registered'),
      t('Active'),
      t('Terminated'),
    ],
    datasets: [
      {
        label: 'status',
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
      <BoxContent>
        <DoughnutChart
          data={doughnutChartData}
          options={{ legend: { display: true } }}
        />
      </BoxContent>
      <BoxContent>
        <span>{t('Total Supply')}</span>
        <Tooltip size="m" position="bottom">
          <p>{t('Total LSK tokens in circulation')}</p>
        </Tooltip>
        <TokenAmount
          val={statistics.data.totalSupplyLSK}
          token={tokenMap.LSK.key}
        />
      </BoxContent>
      <BoxContent>
        <span>{t('Staked')}</span>
        <Tooltip size="m" position="bottom">
          <p>{t('Amount of LSK tokens staked by validators and nominators for DPoS governance')}</p>
        </Tooltip>
        <TokenAmount
          val={statistics.data.stakedLSK}
          token={tokenMap.LSK.key}
        />
      </BoxContent>
    </Box>
  );
};

export default BlockchainApplicationStatistics;
