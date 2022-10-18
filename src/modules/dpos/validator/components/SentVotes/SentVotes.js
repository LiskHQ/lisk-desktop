import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from 'src/modules/common/components/Heading';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';

import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
// import Icon from 'src/theme/Icon';
import styles from './SentVotes.css';
import header from './tableHeaderMap';
import SentVotesRow from '../SentVoteRow';

const SentVotes = ({ history }) => {
  const searchAddress = selectSearchParamValue(history.location.search, 'address');
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();
  const { t } = useTranslation();
  const address = useMemo(() => searchAddress || currentAddress, [searchAddress, currentAddress]);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Votes')}>
          <div className={styles.rightHeaderSection}>
            <div className={styles.votesCountBadge}><span>7</span>/10 votes available in your account</div>
            <div className={styles.actionButtons}>
              <DialogLink component="send">
                <PrimaryButton>{t('Available to unlock')}</PrimaryButton>
              </DialogLink>
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          queryHook={useTokensBalance}
          queryConfig={{ config: { params: { address } } }}
          row={SentVotesRow}
          header={header(t)}
          headerClassName={styles.tableHeader}
          additionalRowProps={{ address }}
        />
      </BoxContent>
    </Box>
  );
};

export default SentVotes;
