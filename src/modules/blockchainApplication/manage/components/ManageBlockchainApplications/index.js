import React from 'react';
import BlockchainApplicationStatistics from '../../../explore/components/BlockchainApplicationStatistics';

const ManageBlockchainAppications = ({ apps, statistics }) => (
  <>
    <BlockchainApplicationStatistics apps={apps} statistics={statistics} />
  </>
);

export default ManageBlockchainAppications;
