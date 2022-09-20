import React from 'react';
import { useTranslation } from 'react-i18next';
import TokenCard from 'src/modules/wallet/components/TokenCard';
import InfoBanner from 'src/modules/common/components/infoBanner/infoBanner';
import BlockchainApplicationList from '@blockchainApplication/explore/components/BlockchainApplicationList';
import BlockchainApplicationStatistics from '../BlockchainApplicationStatistics';
import styles from './BlockchainApplications.css';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';

const BlockchainApplications = ({
  applications,
  statistics,
  applyFilters,
  filters,
}) => {
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
          <BlockchainApplicationList
            applyFilters={applyFilters}
            filters={filters}
            applications={applications}
          />
        </div>
        <div className={styles.sideBar}>
          <BlockchainApplicationStatistics statistics={statistics} />
        </div>
      </div>
      <TokenCard balance={30000000000000} lockedBalance={3000000000} symbol="LSK" url={chainLogo} />
    </div>
  );
};

export default BlockchainApplications;
