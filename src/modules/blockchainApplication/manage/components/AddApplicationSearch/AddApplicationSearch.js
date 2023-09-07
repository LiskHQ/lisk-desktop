import React from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from '@theme/Input';
import Icon from '@theme/Icon';
import styles from './AddApplicationSearch.css';

const AddApplicationSearch = ({
  searchValue,
  isUrl,
  urlStatus,
  isSearchLoading,
  onSearchApplications,
}) => {
  const { t } = useTranslation();
  const status = isUrl ? urlStatus : null;
  return (
    <div className={`${grid.row} ${styles.filterWrapper}`}>
      <div className={styles.filterHolder}>
        <Input
          icon={<Icon className={styles.searchIcon} name="searchInput" />}
          className={styles.chainSearch}
          name="application-filter"
          value={searchValue}
          placeholder={t('Search by name')}
          onChange={({ target: { value } }) => onSearchApplications(value)}
          size="m"
          isLoading={isSearchLoading}
          status={isSearchLoading ? 'pending' : status}
        />
      </div>
    </div>
  );
};

export default AddApplicationSearch;
