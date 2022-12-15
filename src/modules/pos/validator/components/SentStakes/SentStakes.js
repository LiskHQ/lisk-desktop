import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from 'src/modules/common/components/Heading';
import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import Icon from 'src/theme/Icon';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import styles from './SentStakes.css';
import header from './tableHeaderMap';
import SentStakesRow from '../SentStakesRow';
import { usePosConstants, useSentStakes } from '../../hooks/queries';

// eslint-disable-next-line max-statements
const SentStakes = ({ history }) => {
  const { t } = useTranslation();
  const searchAddress = selectSearchParamValue(history.location.search, 'address');
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();

  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);
  const queryParam = { config: { params: { address } } };

  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.tokenIDDPoS } },
    options: { enabled: !isGettingPosConstants },
  });
  const dposToken = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { data } = useSentStakes(queryParam);
  const stakingAvailable = useMemo(() => 10 - data?.meta?.total || 0, [address]);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Stakes')}>
          <div className={styles.rightHeaderSection}>
            <div className={styles.stakesCountBadge}>
              <Icon name="stakingQueueActive" />
              <span>{stakingAvailable}</span>
              /10 {t('stakes available in your account')}
            </div>
            <div className={styles.actionButtons}>
              <DialogLink component="lockedBalance">
                <PrimaryButton>{t('Available to unlock')}</PrimaryButton>
              </DialogLink>
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          queryHook={useSentStakes}
          transformResponse={(resp) => resp?.votes || []}
          queryConfig={queryParam}
          row={SentStakesRow}
          header={header(t)}
          additionalRowProps={{
            dposToken,
          }}
          headerClassName={styles.tableHeader}
        />
      </BoxContent>
    </Box>
  );
};

export default SentStakes;
