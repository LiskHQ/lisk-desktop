/* istanbul ignore file */
import React from 'react';
import BlockchainApplicationStatistics from '../../../explore/components/BlockchainApplicationStatistics';
import styles from './blockchainApplications.css';

const InfoBanner = () => <p className={styles.banner}>banner</p>;
const BlockchainApplicationsList = () => <span>list</span>;

const BlockchainApplications = ({ apps, statistics }) => (
  <div className={styles.wrapper}>
    <InfoBanner />
    <div>
      <div className={styles.content}>
        <BlockchainApplicationsList apps={apps} />
      </div>
      <div className={styles.sideBar}>
        <BlockchainApplicationStatistics statistics={statistics} />
      </div>
    </div>
  </div>
);

export default BlockchainApplications;
