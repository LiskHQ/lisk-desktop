import React from 'react';
// import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import NotFound from '@shared/notFound';
import { isEmpty } from '@utils/helpers';
import delegatePerformanceDetails from './delegatePerformanceDetails';
import styles from '../delegateProfile/styles.css';

// eslint-disable-next-line max-statements
const DelegatePerformance = ({ delegate: { error, isLoading, data } } = {}) => {
  if (!error && isEmpty(data)) {
    return <div />;
  }

  if (error && isEmpty(data)) {
    return <NotFound />;
  }

  const { dpos: { delegate: { pomHeights, status, consecutiveMissedBlocks } } } = data;
  let title = '';
  switch (status) {
    case 'punished':
      title = 'Punishment details';
      break;

    case 'banned':
      title = 'Banning details';
      break;

    default:
      title = 'Unknown details';
  }

  const detailsData = {
    // eslint-disable-next-line no-multi-str
    reason: 'This delegate was punished 3 times. Two more  punishments will cause the permanent ban of the delegate.',
    details: [
      { startHeight: 10273851, endHeight: 10273872 },
      { startHeight: 10058635, endHeight: 10278851 },
      { startHeight: 10273951, endHeight: 10274851 },
    ],
  };
  const { details } = detailsData;

  return (
    <Box isLoading={isLoading} className={`${styles.container}`}>
      {title && (
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
      )}
      <BoxContent className={styles.mainContent}>
        <p>{title}</p>
        <p>{delegatePerformanceDetails(pomHeights.length, status, consecutiveMissedBlocks)}</p>
        <p>
          {details[0].startHeight}
          {' '}
          {details[0].endHeight}
        </p>
      </BoxContent>
    </Box>
  );
};

export default DelegatePerformance;
