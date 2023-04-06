import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import BoxHeader from '@theme/box/header';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import { QueryTable } from '@theme/QueryTable';
import { Input } from '@theme';
import Icon from '@theme/Icon';
import { useFilter } from '@common/hooks';
import useSettings from '@settings/hooks/useSettings';
import { Client } from 'src/utils/api/client';
import useMergeApplicationExploreAndMetaData from '../../../manage/hooks/useMergeApplicationExploreAndMetaData';
import { useBlockchainApplicationExplore } from '../../hooks/queries/useBlockchainApplicationExplore';
import BlockchainApplicationRow from '../BlockchainApplicationRow';
import header from './BlockchainApplicationListHeaderMap';
import styles from './BlockchainApplicationList.css';

const BlockchainApplicationList = () => {
  const [searchValue, setSearchValue] = useState('');
  const { filters, applyFilters } = useFilter();
  const debounceTimeout = useRef(null);
  const { t } = useTranslation();
  const { mainChainNetwork } = useSettings('mainChainNetwork');

  const onSearchApplication = useCallback(
    ({ target }) => {
      const value = target.value;
      setSearchValue(value);
      clearTimeout(debounceTimeout.current);

      debounceTimeout.current = setTimeout(() => {
        applyFilters({
          ...filters,
          search: value,
          offset: 0,
        });
      }, 500);
    },
    [searchValue]
  );

  return (
    <Box main className="chain-application-box">
      <BoxHeader className={styles.boxHeader}>
        <div className={grid['col-xs-6']}>{t('Applications')}</div>
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
        <QueryTable
          showHeader
          queryHook={useBlockchainApplicationExplore}
          queryConfig={{
            config: { params: filters },
            client: new Client({ http: mainChainNetwork?.serviceUrl }),
          }}
          transformResponse={useMergeApplicationExploreAndMetaData}
          row={BlockchainApplicationRow}
          header={header(t)}
          headerClassName={styles.tableHeader}
          additionalRowProps={{ t }}
          emptyState={{
            message: t('There are no blockchain applications.'),
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default BlockchainApplicationList;
