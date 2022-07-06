import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import BoxHeader from 'src/theme/box/header';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Table from 'src/theme/table';
import { Input } from 'src/theme';
import Icon from 'src/theme/Icon';
import {
  selectCurrentBlockHeight,
  selectActiveToken,
} from 'src/redux/selectors';
import BlockchainApplicationRow from '../BlockchainApplicationRow';
import header from './BlockchainApplicationListHeaderMap';
import styles from './BlockchainApplicationList.css';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../../const/constants';

// eslint-disable-next-line max-statements
const Transactions = ({
  sort,
  changeSort,
  applications,
  applyFilters,
  filters,
}) => {
  const currentBlockHeight = useSelector(selectCurrentBlockHeight);
  const activeToken = useSelector(selectActiveToken);
  const [searchValue, setSearchValue] = useState('');
  const lastSearchValue = useRef('');
  const { t } = useTranslation();

  const canLoadMore = useMemo(() =>
    applications.data.length < applications?.meta?.total, [applications]);

  const handleLoadMore = () => {
    applications.loadData({});

    const params = {
      ...filters,
      offset: applications.meta.count + applications.meta.offset,
    };
    applications.loadData(params);
  };

  const onSearchApplication = useCallback(({ target }) => {
    const value = target.value;
    setSearchValue(value);
    debounce(() => {
      lastSearchValue.current = value;
      if (lastSearchValue.current === searchValue) return;

      applyFilters({
        ...filters,
        search: value,
        offset: 0,
        limit: BLOCKCHAIN_APPLICATION_LIST_LIMIT,
      });
    }, 500)();
  }, [searchValue]);

  return (
    <Box main isLoading={applications.isLoading} className="chain-application-box">
      <BoxHeader className={styles.boxHeader}>
        <div className={grid['col-xs-6']}>
          {t('Applications')}
        </div>
        <div align="right" className={grid['col-xs-6']}>
          <div className={styles.filterHolder}>
            <Input
              icon={<Icon className={styles.searchIcon} name="searchActive" />}
              className={styles.chainSearch}
              name="filter"
              value={searchValue}
              placeholder={t('Search application')}
              onChange={onSearchApplication}
              size="m"
            />
          </div>
        </div>
      </BoxHeader>
      <BoxContent className={`${styles.content} chain-application-result`}>
        <Table
          data={applications.data}
          isLoading={applications.isLoading}
          row={BlockchainApplicationRow}
          loadData={handleLoadMore}
          additionalRowProps={{
            currentBlockHeight,
            activeToken,
            layout: 'full',
          }}
          header={header(changeSort, t)}
          headerClassName={styles.tableHeader}
          currentSort={sort}
          canLoadMore={canLoadMore}
          error={applications.error}
          emptyState={{
            message: t('There are no blockchain applications.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default Transactions;
