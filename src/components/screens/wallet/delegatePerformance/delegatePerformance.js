import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import NotFound from '@shared/notFound';
import { isEmpty } from '@utils/helpers';
import delegatePerformanceDetails from './delegatePerformanceDetails';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const DelegatePerformance = ({ delegate: { error, isLoading, data } } = {}) => {
  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound />;
  }

  const { dpos: { delegate: { pomHeights, status, consecutiveMissedBlocks } } } = data;
  const headerTitle = {
    punished: 'Punishment details',
    banned: 'Ban details',
  };

  return (
    <Box isLoading={isLoading} className={`${styles.container}`}>
      <BoxHeader className={styles.container}>
        <h1>{headerTitle[status]}</h1>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Box className={grid.row}>
          <Box className={`${grid['col-md-12']} ${grid['col-xs-12']}`}>
            <p className={styles.description}>
              {delegatePerformanceDetails(pomHeights.length, status, consecutiveMissedBlocks)}
            </p>
          </Box>
        </Box>
        <Box className={`${grid.row} ${styles.performanceContainer}`}>
          <Box className={`${grid['col-md-6']} ${grid['col-xs-12']} ${styles.start}`}>
            <p className={styles.header}>Punishment starts</p>
          </Box>
          <Box className={`${grid['col-md-6']} ${grid['col-xs-12']} ${styles.end}`}>
            <p className={styles.header}>Punishment ends</p>
          </Box>
        </Box>
        {pomHeights && pomHeights.map((height, index) => (
          <Box className={`${grid.row} ${styles.performanceContainer}`} key={`${height.start}-${index}`}>
            <Box className={`${grid['col-md-6']} ${grid['col-xs-12']} ${styles.start}`}>
              <p className={styles.details}>{height.start}</p>
            </Box>
            <Box className={`${grid['col-md-6']} ${grid['col-xs-12']} ${styles.end}`}>
              <p className={styles.details}>{height.end}</p>
            </Box>
          </Box>
        ))}
      </BoxContent>
    </Box>
  );
};

export default DelegatePerformance;
