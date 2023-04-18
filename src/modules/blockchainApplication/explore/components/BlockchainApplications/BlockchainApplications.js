import React from 'react';
import { useTranslation } from 'react-i18next';
import TabsContainer from 'src/theme/tabs/tabsContainer/tabsContainer';
import InfoBanner from 'src/modules/common/components/infoBanner/infoBanner';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';
import styles from './BlockchainApplications.css';
import SessionManager from '../../../connection/components/SessionManager';

const BlockchainApplications = ({ applications, statistics, applyFilters, filters }) => {
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
