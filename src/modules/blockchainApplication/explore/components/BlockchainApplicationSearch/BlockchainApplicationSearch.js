import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from '@theme/Input';
import Icon from '@theme/Icon';
import styles from './BlockchainApplicationSearch.css';

const BlockchainApplicationSearch = ({
  searchValue,
  error,
  isURl,
  urlStatus,
  isLoading,
  onSearchApplications,
}) => {
  const { t } = useTranslation();
  const status = isURl ? urlStatus : null;
  return (
    <div className={`${grid.row} ${styles.filterWrapper}`}>
      <div className={styles.filterHolder}>
        <Input
          icon={<Icon className={styles.searchIcon} name="searchActive" />}
          className={styles.chainSearch}
          name="application-filter"
          value={searchValue}
          placeholder={t('Search by name or application URL')}
          onChange={onSearchApplications}
          size="m"
          isLoading={isLoading}
          status={isLoading ? 'pending' : status}
          feedback={error}
        />
      </div>
    </div>
  );
};

export default BlockchainApplicationSearch;
