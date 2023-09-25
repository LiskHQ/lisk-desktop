/* eslint-disable max-statements */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Heading from 'src/modules/common/components/Heading';
import { useFilter } from 'src/modules/common/hooks';
import { useTokenBalances } from 'src/modules/token/fungible/hooks/queries';
import routes from 'src/routes/routes';
import { Input } from 'src/theme';
import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { useCurrentAccount } from '@account/hooks';
import Icon from 'src/theme/Icon';
import styles from './AllTokens.css';
import header from './tableHeaderMap';
import TokenRow from '../TokenRow';

const AllTokens = ({ history }) => {
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const { t } = useTranslation();
  const timeout = useRef();

  const [searchToken, setSearch] = useState('');
  const [shouldShowSearch, setShouldShowSearch] = useState(true);
  const { filters, setFilter } = useFilter();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const isSendDisabled = queryParams.get('disableSend') === 'true';
  const searchAddress = Boolean(queryParams.get('address'));

  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);
  const params = useMemo(() => ({ address, ...filters }), [address, filters]);

  const handleFilter = useCallback(({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('search', value);
    }, 500);
  }, []);

  const handleGoBack = () => history.push(routes.wallet.path);

  const onGetTokenBalance = ({ data, isFetched }) => {
    const tokenBalanceLength = data?.data?.length;
    setShouldShowSearch(isFetched && tokenBalanceLength >= 10);
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('All tokens')} onGoBack={handleGoBack}>
          <div className={styles.rightHeaderSection}>
            {shouldShowSearch && (
              <Input
                icon={<Icon className={styles.searchIcon} name="searchActive" />}
                onChange={handleFilter}
                value={searchToken}
                className={styles.filterTokens}
                size="l"
                name="search-token"
                placeholder={t('Search token')}
              />
            )}
            <div className={styles.actionButtons}>
              <DialogLink component="request">
                <SecondaryButton>{t('Request')}</SecondaryButton>
              </DialogLink>
              <DialogLink component="send">
                <PrimaryButton disabled={isSendDisabled}>{t('Send')}</PrimaryButton>
              </DialogLink>
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          onQueryChange={onGetTokenBalance}
          queryHook={useTokenBalances}
          queryConfig={{ config: { params } }}
          row={TokenRow}
          header={header(t)}
          headerClassName={styles.tableHeader}
          emptyState={{
            message: t('You do not have any tokens yet.'),
            illustration: 'emptyTokensIllustration',
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default AllTokens;
