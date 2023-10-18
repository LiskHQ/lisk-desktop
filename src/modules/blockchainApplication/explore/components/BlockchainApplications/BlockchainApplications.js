import React from 'react';
import { useTranslation } from 'react-i18next';
import TabsContainer from '@theme/tabs/tabsContainer/tabsContainer';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import SwippableInfoBanner from '@common/components/infoBanner/swippableInfoBanner';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';
import styles from './BlockchainApplications.css';
import banners from './banners';
import SessionManager from '../../../connection/components/SessionManager';

const BlockchainApplications = ({ applications, statistics, applyFilters, filters }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <SwippableInfoBanner banners={banners} name="blockchainApplicationsPageBanner" />
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <TabsContainer name="main-tabs" activeTab="blockchainApplications">
            <BlockchainApplicationList
              applyFilters={applyFilters}
              filters={filters}
              applications={applications}
              name={t('Explore applications')}
              id="blockchainApplications"
            />
            <SessionManager name={t('Wallet connections')} id="SessionManager" />
          </TabsContainer>
        </div>
        <div className={styles.sideBar}>
          <BlockchainApplicationStatistics statistics={statistics} />
        </div>
      </div>
    </div>
  );
};

export default BlockchainApplications;
