// istanbul ignore file
import React from 'react';
import moment from 'moment';
import { ROUND_LENGTH } from '@constants';
import { DoughnutChart } from '@views/basics/charts';
import Box from '@views/basics/box';
import BoxHeader from '@views/basics/box/header';
import BoxContent from '@views/basics/box/content';
import BoxEmptyState from '@views/basics/box/emptyState';
import GuideTooltip, { GuideTooltipItem } from '@views/basics/charts/guideTooltip';
import Icon from '@views/basics/icon';
import { useTheme } from '@utils/theme';
import { getColorPalette } from '@utils/chartOptions';
import NumericInfo from './numericInfo';
import Forger from './forger';
import styles from './overview.css';

const FORGERS_TO_SHOW = 6;

const getForgingStats = (data, forgedInRound = 0) => {
  const missedBlocks = data.filter(item => item.state === 'missedBlock').length;
  return [forgedInRound, ROUND_LENGTH - forgedInRound, missedBlocks];
};

const ProgressBar = ({ forgedInRound, theme }) => (
  <div className={`${styles.progressBar} ${styles[theme]}`}>
    <div className={`${styles.lineForged} ${styles[theme]}`} style={{ width: `${(forgedInRound / ROUND_LENGTH) * 100}%` }} />
  </div>
);

const formatToTwoDigits = str => str.toLocaleString('en-US', { minimumIntegerDigits: 2 });

const getPassedMinutes = (startTime) => {
  const seconds = Math.floor((new Date()).getTime() / 1000) - startTime;
  if (!seconds) return '00:00';
  const duration = moment.duration({ seconds });
  return `${formatToTwoDigits(duration.minutes())}:${formatToTwoDigits(duration.seconds())}`;
};

const ForgingDetails = ({
  t, forgers, forgedInRound, startTime,
}) => {
  const theme = useTheme();
  const colorPalette = getColorPalette(theme);
  const delegatesForgedLabels = [
    t('Forging'),
    t('Awaiting slot'),
    t('Missed slot'),
  ];

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

  const forgersListToShow = forgers.slice(1, FORGERS_TO_SHOW + 1);

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
                  <h2 className={styles.title}>{t('Slot status')}</h2>
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
                  <ProgressBar forgedInRound={forgedInRound} theme={theme} />
                  <p className={styles.blue}>
                    <span className="blocksForged">{`${forgedInRound} `}</span>
                    <span>{`/ ${ROUND_LENGTH}`}</span>
                  </p>
                </main>
              </section>
              <NumericInfo
                title="Minutes passed"
                value={`${getPassedMinutes(startTime)}`}
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
