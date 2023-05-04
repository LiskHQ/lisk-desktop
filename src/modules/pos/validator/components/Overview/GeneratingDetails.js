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
import { useGenerators } from '../../hooks/queries/useGenerators';
import NumericInfo from './NumericInfo';
import Generator from './Generator';
import styles from './Overview.css';

const GENERATORS_TO_SHOW = 6;

const getGeneratingStats = (data, generatedInRound = 0) => {
  const missedBlocks = data.filter((item) => item.state === 'missedBlock').length;
  return [generatedInRound, ROUND_LENGTH - generatedInRound, missedBlocks];
};

const ProgressBar = ({ generatedInRound, theme }) => (
  <div className={`${styles.progressBar} ${styles[theme]}`}>
    <div
      className={`${styles.lineGenerated} ${styles[theme]}`}
      style={{ width: `${(generatedInRound / ROUND_LENGTH) * 100}%` }}
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

const GeneratingDetails = ({ t, generatedInRound, startTime }) => {
  const theme = useTheme();
  const colorPalette = getColorPalette(theme);
  const validatorsGeneratedLabels = [t('Generated slots'), t('Awaiting slots'), t('Missed slots')];

  // The API returns only one generator, so we need to fetch all of them
  const { data: generatorsData } = useGenerators({ config: { params: { limit: 103 } } });
  const generators = generatorsData?.data ?? [];

  const doughnutChartData = {
    labels: validatorsGeneratedLabels,
    datasets: [
      {
        label: 'status',
        data: getGeneratingStats(generators, generatedInRound),
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

  const generatorsListToShow = generators.slice(1, GENERATORS_TO_SHOW + 1);

  return (
    <Box className={styles.wrapper}>
      <BoxContent className={styles.content}>
        <div className={styles.column}>
          {generators.length ? (
            <div className={styles.chartBox}>
              <h2 className={styles.title}>{t('Validator slot status')}</h2>
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
                  {validatorsGeneratedLabels.map((label, i) => (
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
                <Icon name="blocksGenerated" />
                <main className={styles.main}>
                  <h6>{t('Blocks generated')}</h6>
                  <ProgressBar generatedInRound={generatedInRound} theme={theme} />
                  <p className={styles.blue}>
                    <span className="blocksGenerated">{`${generatedInRound} `}</span>
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
        <div className={`${styles.column} ${styles.nextGenerators}`}>
          <div className={styles.chartBox}>
            <h2 className={styles.title}>{t('Next generators')}</h2>
            <nav className={styles.list}>
              {generatorsListToShow.map((generator) => (
                <Generator key={generator.address} generator={generator} />
              ))}
            </nav>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default GeneratingDetails;
