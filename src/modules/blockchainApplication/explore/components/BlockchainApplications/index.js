/* istanbul ignore file */
import React from 'react';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import Box from 'src/theme/box';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';

const ManageBlockchainAppications = ({
  applications,
  statistics,
  applyFilters,
  filters,
}) => (
  <Box>
    <BlockchainApplicationList
      applications={applications}
      applyFilters={applyFilters}
      filters={filters}
    />
    <BlockchainApplicationStatistics statistics={statistics} />
  </Box>
);

export default ManageBlockchainAppications;
