import React from 'react';
// import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import styles from './styles.css';

const DelegatePerformance = ({ title }) => {
// const DelegatePerformance = ({ title, data: { reason, details } }) => {
  const detailsData = {
    // eslint-disable-next-line no-multi-str
    reason: 'This delegate was punished 3 times. Two more  punishments will cause the permanent ban of the delegate.',
    details: [
      { startHeight: 10273851, endHeight: 10273872 },
      { startHeight: 10058635, endHeight: 10278851 },
      { startHeight: 10273951, endHeight: 10274851 },
    ],
  };
  const { reason, details } = detailsData;
  return (
    <Box className={`${styles.container}`}>
      {title && (
        <BoxHeader>
          <h1>{title}</h1>
        </BoxHeader>
      )}
      <BoxContent className={styles.mainContent}>
        <p>{title}</p>
        <p>{reason}</p>
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
