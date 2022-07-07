import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import BoxHeader from 'src/theme/box/header';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Table from 'src/theme/table';
import { Input } from 'src/theme';
import Icon from 'src/theme/Icon';
import BlockchainApplicationRow from '../BlockchainApplicationRow';
import header from './BlockchainApplicationListHeaderMap';
import styles from './BlockchainApplicationList.css';
import { BLOCKCHAIN_APPLICATION_LIST_LIMIT } from '../../const/constants';
import BlockchainApplicationSkeleton from '../BlockchainApplicationSkeleton';

// eslint-disable-next-line max-statements
const BlockchainApplicationList = ({
  applications: apps,
  applyFilters,
  filters,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const debounceTimeout = useRef(null);
  const { t } = useTranslation();
  const { pins, checkPinByChainId, togglePin } = usePinBlockchainApplication();

  const applications = useMemo(() => {
    if (pins.length && apps.data.length) {
      return {
        ...apps,
        data: apps.data.map(chainData => ({
          ...chainData,
          isPinned: checkPinByChainId(chainData.chainID),
        }
        )),
      };
    }
    return apps;
  }, [apps, checkPinByChainId]);

  const canLoadMore = useMemo(() =>
    (applications.meta
      ? applications.data.length < applications.meta.total : false), [applications]);

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
    clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      applyFilters({
        ...filters,
        search: value,
        offset: 0,
        limit: BLOCKCHAIN_APPLICATION_LIST_LIMIT,
      });
    }, 500);
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
              name="application-filter"
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
          showHeader
          data={applications.data}
          isLoading={applications.isLoading}
          loadingState={BlockchainApplicationSkeleton}
          row={BlockchainApplicationRow}
          loadData={handleLoadMore}
          header={header(t)}
          headerClassName={styles.tableHeader}
          canLoadMore={canLoadMore}
          error={applications.error}
          additionalRowProps={{
            t,
            togglePin,
          }}
          emptyState={{
            message: t('There are no blockchain applications.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default BlockchainApplicationList;
