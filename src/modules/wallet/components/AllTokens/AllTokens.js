import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from 'src/modules/common/components/Heading';
import { useFilter } from 'src/modules/common/hooks';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';

import { Input } from 'src/theme';
import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import Icon from 'src/theme/Icon';
import styles from './AllTokens.css';
import header from './tableHeaderMap';
import TokenRow from '../TokenRow';

const AllTokens = ({ history }) => {
  const searchAddress = selectSearchParamValue(history.location.search, 'address');
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const { t } = useTranslation();
  const timeout = useRef();

  const [search, setSearch] = useState('');
  const { filters, setFilter } = useFilter({});
  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);
  const params = useMemo(() => ({ address, ...filters }), [address, filters]);

  const handleFilter = useCallback(({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('search', value);
    }, 500);
  }, []);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('All tokens')}>
          <div className={styles.rightHeaderSection}>
            <Input
              icon={<Icon className={styles.searchIcon} name="searchActive" />}
              onChange={handleFilter}
              value={search}
              className={styles.filterTokens}
              size="l"
              name="search-token"
              placeholder={t('Search token')}
            />
            <div className={styles.actionButtons}>
              <DialogLink component="request">
                <SecondaryButton>{t('Request')}</SecondaryButton>
              </DialogLink>
              <DialogLink component="send">
                <PrimaryButton>{t('Send')}</PrimaryButton>
              </DialogLink>
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          queryHook={useTokensBalance}
          queryConfig={{ config: { params } }}
          row={TokenRow}
          header={header(t)}
          headerClassName={styles.tableHeader}
          additionalRowProps={{ address }}
        />
      </BoxContent>
    </Box>
  );
};

export default AllTokens;
