/* istanbul ignore file */
import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoBanner from 'src/modules/common/components/infoBanner/infoBanner';
import BlockchainApplicationStatistics from '../../../explore/components/BlockchainApplicationStatistics';
import styles from './blockchainApplications.css';

// TODO use correct component when #4355 ticket it completed
const BlockchainApplicationsList = () => <span>list</span>;

const BlockchainApplications = ({ apps, statistics }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <InfoBanner
        className={styles.banner}
        t={t}
        name="blockchainApplicationsPageBanner"
        infoLabel={t('New')}
        infoMessage={t('Explore decentralized applications')}
        infoDescription={t('Description')}
        infoLink="https://lisk.io"
        show
      />
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
};

export default BlockchainApplications;
