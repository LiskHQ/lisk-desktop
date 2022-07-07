/* istanbul ignore file */
import React from 'react';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';

const ManageBlockchainAppications = ({ apps, statistics }) => (
  <BlockchainApplicationStatistics apps={apps} statistics={statistics} />
);

export default ManageBlockchainAppications;
