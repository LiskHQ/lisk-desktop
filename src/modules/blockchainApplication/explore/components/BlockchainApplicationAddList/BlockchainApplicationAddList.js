import React from 'react';
import Box from '@theme/box';
import Dialog from '@theme/dialog/dialog';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import styles from './BlockchainApplicationAddList.css';

const BlockchainApplicationAddList = ({
  applications,
  applyFilters,
  filters,
}) => (
  <Dialog hasClose>
    <Box className={styles.wrapper}>
      <div className={styles.header}>Add Application</div>
      <BlockchainApplicationList
        applications={applications}
        applyFilters={applyFilters}
        filters={filters}
      />
    </Box>
  </Dialog>
);

export default BlockchainApplicationAddList;
