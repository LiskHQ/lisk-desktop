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
import styles from './SentVotes.css';
import header from './tableHeaderMap';
import SentVotesRow from '../SentVotesRow';
import { useDposConstants, useSentVotes } from '../../hooks/queries';

// eslint-disable-next-line max-statements
const SentVotes = ({ history }) => {
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
  const { data: dposConstants, isLoading: isGettingDposConstants } = useDposConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: dposConstants?.tokenIDDPoS } },
    options: { enabled: !isGettingDposConstants },
  });
  const dposToken = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { data } = useSentVotes(queryParam);
  const votingAvailable = useMemo(() => 10 - data?.meta?.total || 0, [address]);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Votes')}>
          <div className={styles.rightHeaderSection}>
            <div className={styles.votesCountBadge}>
              <Icon name="votingQueueActive" />
              <span>{votingAvailable}</span>
              /10 {t('votes available in your account')}
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
          queryHook={useSentVotes}
          transformResponse={(resp) => resp?.votes || []}
          queryConfig={queryParam}
          row={SentVotesRow}
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

export default SentVotes;
