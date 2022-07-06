/* istanbul ignore file */
import React from 'react';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import Box from 'src/theme/box';
import BlockchainApplicationStatistics from '../../../explore/components/BlockchainApplicationStatistics';

const ManageBlockchainAppications = ({ apps, statistics }) => (
  <Box>
    <BlockchainApplicationList />
    <BlockchainApplicationStatistics apps={apps} statistics={statistics} />
  </Box>
);

export default ManageBlockchainAppications;
