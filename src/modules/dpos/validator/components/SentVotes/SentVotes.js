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
import { useSentVotes } from '../../hooks/queries';

// @Todo this is just a place holder pending when dpos constants are integrated by useDposContants hook
const dposTokenId = '0'.repeat(16);

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


  const { data: tokens } = useTokensBalance({ config: { params: { tokenID: dposTokenId } } });
  const dposToken = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const { data } = useSentVotes(queryParam);
  const votingAvailable = useMemo(() => 10 - data?.meta?.total || 0, [address]);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Votes')}>
          <div className={styles.rightHeaderSection}>
            <div className={styles.votesCountBadge}>
              <Icon name="votingQueueActive" /> <span>{votingAvailable}</span>
              {t('/10 votes available in your account')}
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
