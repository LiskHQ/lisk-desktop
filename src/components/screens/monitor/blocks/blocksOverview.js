import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import Chart from '../../../toolbox/charts';
import styles from './blocksOverview.css';
import { chartStyles } from '../../../../constants/chartConstants';

const BlocksOverview = ({ t, blocks }) => {
  const data = {
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

  return (
    <Box>
      <BoxHeader>
        <h2>{t('Overview')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={grid.row}>
          <div className={`${grid['col-sm-8']} ${styles.cell}`}>
            <h2 className={styles.cellHeader}>{t('Transactions per block')}</h2>
            <Chart
              type="bar"
              options={options}
              data={data}
            />
          </div>
          <div className={grid['col-sm-4']}>
            <h2 className={styles.cellHeader}>{t('Empty/Not empty')}</h2>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default BlocksOverview;
