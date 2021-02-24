// istanbul ignore file
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DoughnutChart } from '../../../toolbox/charts';
import AccountVisual from '../../../toolbox/accountVisual';
import routes from '../../../../constants/routes';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './overview.css';
import NumericInfo from './numericInfo';
import BoxEmptyState from '../../../toolbox/box/emptyState';
import GuideTooltip, { GuideTooltipItem } from '../../../toolbox/charts/guideTooltip';
import { colorPalette } from '../../../../constants/chartConstants';
import { MAX_BLOCKS_FORGED } from '../../../../constants/delegates';

const FORGERS_TO_SHOW = 6;

const getForgingStats = (data) => {
  const statuses = {
    forging: 0,
    awaitingSlot: 0,
    notForging: 0,
    missedBlock: 0,
  };
  Object.values(data)
    .forEach((item) => {
      statuses[item.status]++;
    });
  return Object.values(statuses);
};

const Forger = ({ forger }) => (
  <div className={`${styles.forger} forger-item`}>
    <Link to={`${routes.account.path}?address=${forger.address}`}>
      <AccountVisual
        address={forger.address}
        className={styles.accountVisual}
      />
      <span>{forger.username}</span>
    </Link>
  </div>
);

const getPassedMinutes = forgedBlocks => (
  `${String(Math.floor(forgedBlocks / 6)).padStart(2, '0')}:${String(forgedBlocks % 6).padEnd(2, '0')}`
);

const timeForMaxBlocksForged = getPassedMinutes(MAX_BLOCKS_FORGED);

const ForgingDetails = ({
  t, chartDelegatesForging,
}) => {
  const delegatesForgedLabels = [
    t('Forging'),
    t('Awaiting slot'),
    t('Not forging'),
    t('Missed block'),
  ];
  const { latestBlocks, awaitingForgers } = useSelector(state => state.blocks);
  const forgedInRound = latestBlocks.length
    ? latestBlocks[0].height % MAX_BLOCKS_FORGED : 0;

  const doughnutChartData = {
    labels: delegatesForgedLabels,
    datasets: [
      {
        label: 'status',
        data: getForgingStats(chartDelegatesForging),
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

  const forgersListToShow = awaitingForgers.slice(forgedInRound, forgedInRound + FORGERS_TO_SHOW);

  if (forgersListToShow.length < FORGERS_TO_SHOW) {
    forgersListToShow.push(
      ...awaitingForgers.slice(0, FORGERS_TO_SHOW - forgersListToShow.length),
    );
  }
  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Forging details')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {
            Object.keys(chartDelegatesForging).length
              ? (
                <div className={styles.chartBox}>
                  <h2 className={styles.title}>{t('Delegates Forging Status')}</h2>
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
                      {delegatesForgedLabels.map((label, i) => (
                        <GuideTooltipItem key={label} color={colorPalette[i]} label={label} />
                      ))}
                    </GuideTooltip>
                  </div>
                </div>
              )
              : <BoxEmptyState><p>{t('No delegates information')}</p></BoxEmptyState>
          }
        </div>
        <div className={styles.column}>
          <div className={styles.centered}>
            <h2 className={styles.title}>
              <span>{t('Round status')}</span>
            </h2>
            <div className={styles.list}>
              <NumericInfo
                title="Blocks forged"
                value={`${forgedInRound} / ${MAX_BLOCKS_FORGED}`}
                icon="blocksForged"
              />
              <NumericInfo
                title="Minutes passed"
                value={`${getPassedMinutes(forgedInRound)} / ${timeForMaxBlocksForged}`}
                icon="clock"
              />
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.nextForgers}`}>
          <div className={styles.chartBox}>
            <h2 className={styles.title}>{t('Next forgers')}</h2>
            <nav className={styles.list}>
              {
                forgersListToShow
                  .map(forger => (
                    <Forger key={forger.address} forger={forger} />
                  ))
              }
            </nav>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ForgingDetails;
