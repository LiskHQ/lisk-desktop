/* istanbul ignore file */
import React from 'react';
import BlockchainApplicationStatistics from '../../../explore/manager/BlockchainApplications';

const ManageBlockchainAppications = ({ apps, statistics }) => (
  <BlockchainApplicationStatistics apps={apps} statistics={statistics} />
);

export default ManageBlockchainAppications;
