import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from '@theme/Input';
import Icon from '@theme/Icon';
import { useSearchApplications } from '../../hooks/useSearchApplication';
import styles from './BlockchainApplicationSearch.css';

const BlockchainApplicationSearch = ({ applyFilters, filters }) => {
  const { t } = useTranslation();
  const { searchValue, setSearchValue, loading } = useSearchApplications(applyFilters, filters);
  const onSearchApplication = ({ target: { value } }) => {
    setSearchValue(value);
  };
  return (
    <div className={`${grid.row} ${styles.filterWrapper}`}>
      <div className={styles.filterHolder}>
        <Input
          icon={<Icon className={styles.searchIcon} name="searchActive" />}
          className={styles.chainSearch}
          name="application-filter"
          value={searchValue}
          placeholder={t('Search by name or application URL')}
          onChange={onSearchApplication}
          size="m"
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default BlockchainApplicationSearch;
