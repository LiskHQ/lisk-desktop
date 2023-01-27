// istanbul ignore file
import React from 'react';
import moment from 'moment';
import { ROUND_LENGTH } from '@pos/validator/consts';
import { DoughnutChart } from 'src/modules/common/components/charts';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxEmptyState from 'src/theme/box/emptyState';
import GuideTooltip, { GuideTooltipItem } from 'src/modules/common/components/charts/guideTooltip';
import Icon from 'src/theme/Icon';
import { useTheme } from 'src/theme/Theme';
import { getColorPalette } from 'src/modules/common/components/charts/chartOptions';
import { useForgersGenerator } from '../../hooks/queries/useForgersGenerator';
import NumericInfo from './NumericInfo';
import Forger from './Forger';
import styles from './Overview.css';

const FORGERS_TO_SHOW = 6;

const getForgingStats = (data, forgedInRound = 0) => {
  const missedBlocks = data.filter((item) => item.state === 'missedBlock').length;
  return [forgedInRound, ROUND_LENGTH - forgedInRound, missedBlocks];
};

const ProgressBar = ({ forgedInRound, theme }) => (
  <div className={`${styles.progressBar} ${styles[theme]}`}>
    <div
      className={`${styles.lineForged} ${styles[theme]}`}
      style={{ width: `${(forgedInRound / ROUND_LENGTH) * 100}%` }}
    />
  </div>
);

const formatToTwoDigits = (str) => str.toLocaleString('en-US', { minimumIntegerDigits: 2 });

const getPassedMinutes = (startTime) => {
  const seconds = Math.floor(new Date().getTime() / 1000) - startTime;
  if (!seconds) return '00:00';
  const duration = moment.duration({ seconds });
  return `${formatToTwoDigits(duration.minutes())}:${formatToTwoDigits(duration.seconds())}`;
};

const ForgingDetails = ({ t, forgedInRound, startTime }) => {
  const theme = useTheme();
  const colorPalette = getColorPalette(theme);
  const validatorsForgedLabels = [t('Forged blocks'), t('Awaiting slot'), t('Missed blocks')];
  const { data: forgersData } = useForgersGenerator({ config: { params: { limit: 103 } } });
  const generators = forgersData?.data ?? [];

  const doughnutChartData = {
    labels: validatorsForgedLabels,
    datasets: [
      {
        label: 'status',
        data: getForgingStats(generators, forgedInRound),
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

  const forgersListToShow = generators.slice(1, FORGERS_TO_SHOW + 1);

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {generators.length ? (
            <div className={styles.chartBox}>
              <h2 className={styles.title}>{t('Validator Forging Status')}</h2>
              <div className={`${styles.chart} showOnLargeViewPort`}>
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
                  {validatorsForgedLabels.map((label, i) => (
                    <GuideTooltipItem key={label} color={colorPalette[i]} label={label} />
                  ))}
                </GuideTooltip>
              </div>
            </div>
          ) : (
            <BoxEmptyState>
              <p>{t('No validators information')}</p>
            </BoxEmptyState>
          )}
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
            <h2 className={styles.title}>{t('Next generators')}</h2>
            <nav className={styles.list}>
              {forgersListToShow.map((forger) => (
                <Forger key={forger.address} forger={forger} />
              ))}
            </nav>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ForgingDetails;
