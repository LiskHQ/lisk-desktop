import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Chart from '../../../toolbox/charts';
import styles from './blocksOverview.css';
import { chartStyles } from '../../../../constants/chartConstants';

const BlocksOverview = ({ t, blocks }) => {
  const barChartData = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => ''),
    datasets: [{
      label: 'block data',
      data: blocks.data.map(block => block.numberOfTransactions).slice(0, 10),
      backgroundColor: chartStyles.ultramarineBlue,
    }],
  };

  const options = {
    legend: {
      display: false,
    },
  };

  const doughnutChartData = {
    labels: ['Empty', 'Not Empty'],
    datasets: [{
      backgroundColor: [chartStyles.mystic, chartStyles.ultramarineBlue],
      data: blocks.data.splice(0, 10).reduce((acc, item) => {
        if (item.numberOfTransactions) acc[1]++;
        else acc[0]++;
        return acc;
      }, [0, 0]),
    }],
  };

  const douthnutChartOptions = {
    cutoutPercentage: 70,
  };

  return (
    <Box>
      <BoxHeader>
        <h2>{t('Overview')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={`${grid.row} ${styles.box}`}>
          <div className={`${grid['col-sm-8']} ${styles.cell}`}>
            <h2 className={styles.cellHeader}>{t('Transactions per block')}</h2>
            <Chart
              type="bar"
              options={options}
              data={barChartData}
            />
          </div>
          <div className={`${grid['col-sm-4']} ${styles.cell}`}>
            <h2 className={styles.cellHeader}>{t('Empty/Not empty')}</h2>
            <Chart
              type="doughnut"
              data={doughnutChartData}
              options={douthnutChartOptions}
              width={900}
              height={900}
            />
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default BlocksOverview;
