// istanbul ignore file
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { routes, colorPalette, ROUND_LENGTH } from '@constants';
import { DoughnutChart } from '@toolbox/charts';
import AccountVisual from '@toolbox/accountVisual';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxEmptyState from '@toolbox/box/emptyState';
import GuideTooltip, { GuideTooltipItem } from '@toolbox/charts/guideTooltip';
import Icon from '@toolbox/icon';
import NumericInfo from './numericInfo';
import styles from './overview.css';

const FORGERS_TO_SHOW = 6;

const getForgingStats = (data, forgedInRound) => {
  if (forgedInRound === 0) return [0, 103, 0];
  const statuses = {
    forging: 0,
    awaitingSlot: 0,
    missedBlock: 0,
  };
  data.forEach((item) => {
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

const ProgressBar = ({ forgedInRound }) => (
  <div className={styles.progressBar}>
    <div className={styles.lineForged} style={{ width: `${(forgedInRound / ROUND_LENGTH) * 100}%` }} />
  </div>
);

const formatToTwoDigits = str => str.toLocaleString('en-US', { minimumIntegerDigits: 2 });

const getPassedMinutes = (lastBlock = {}, firstRoundBlock = {}) => {
  const seconds = lastBlock.timestamp - firstRoundBlock.timestamp;
  if (!seconds) return '00:00';
  const duration = moment.duration({ seconds });
  return `${formatToTwoDigits(duration.minutes())}:${formatToTwoDigits(duration.seconds())}`;
};

const ForgingDetails = ({
  t, forgers,
}) => {
  const delegatesForgedLabels = [
    t('Forging'),
    t('Awaiting slot'),
    t('Missed block'),
  ];
  const { latestBlocks } = useSelector(state => state.blocks);
  const forgedInRound = latestBlocks.length
    ? latestBlocks[0].height % ROUND_LENGTH : 0;

  const doughnutChartData = {
    labels: delegatesForgedLabels,
    datasets: [
      {
        label: 'status',
        data: getForgingStats(forgers, forgedInRound),
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

  const forgersListToShow = forgers.slice(0, FORGERS_TO_SHOW);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Forging details')}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {
            forgers.length
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
              <section className={styles.numericInfo}>
                <Icon name="blocksForged" />
                <main className={styles.main}>
                  <h6>{t('Blocks forged')}</h6>
                  <ProgressBar forgedInRound={forgedInRound} />
                  <p className={styles.blue}>
                    {`${forgedInRound} / `}
                    <span>{` ${ROUND_LENGTH}`}</span>
                  </p>
                </main>
              </section>
              <NumericInfo
                title="Minutes passed"
                value={`${getPassedMinutes(latestBlocks[0], latestBlocks[forgedInRound])}`}
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
