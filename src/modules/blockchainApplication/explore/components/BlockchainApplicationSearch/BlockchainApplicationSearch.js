import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from '@theme/Input';
import Icon from '@theme/Icon';
import { useSearchApplications } from '../../hooks/useSearchApplication';
import styles from './BlockchainApplicationSearch.css';

const BlockchainApplicationSearch = ({
  externalApplications,
  applyFilters,
  filters,
}) => {
  const timeout = useRef();
  const { t } = useTranslation();
  const {
    searchValue,
    setSearchValue,
    error,
    feedback,
    urlSearch,
    loading,
    searchApplication,
  } = useSearchApplications(
    externalApplications,
    applyFilters,
    filters,
  );
  const onSearchApplication = ({ target: { value } }) => {
    setSearchValue(value);
    clearTimeout(timeout.current);
    // Validate the URL with debouncer
    timeout.current = setTimeout(() => {
      searchApplication(value);
    }, 500);
  };
  const urlSearchErrorStatus = error < 1 ? 'ok' : 'error';
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
          status={urlSearch ? urlSearchErrorStatus : null}
          feedback={feedback}
        />
      </div>
    </div>
  );
};

export default BlockchainApplicationSearch;
