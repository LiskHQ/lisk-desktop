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
import { useTokensBalance } from '@token/fungible/hooks/queries';
import StakesCount from '@pos/validator/components/StakesCount';
import styles from './SentStakes.css';
import header from './tableHeaderMap';
import SentStakesRow from '../SentStakesRow';
import { usePosConstants, useSentStakes } from '../../hooks/queries';

function useStakerAddress(searchParam) {
  const searchAddress = selectSearchParamValue(searchParam, 'address');
  const [currentAccount] = useCurrentAccount();
  return searchAddress || currentAccount?.metadata?.address;
}

// eslint-disable-next-line max-statements
const SentStakes = ({ history }) => {
  const { t } = useTranslation();
  const stakerAddress = useStakerAddress(history.location.search);
  const sentStakesQueryConfig = { config: { params: { address: stakerAddress} } };

  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();

  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.data?.posTokenID, address: stakerAddress } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Stakes')}>
          <div className={styles.rightHeaderSection}>
            <StakesCount className={styles.stakesCountProp} sentStakesQueryConfig={sentStakesQueryConfig} />
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
          transformResponse={(resp) => resp?.stakes || []}
          queryConfig={sentStakesQueryConfig}
          row={SentStakesRow}
          header={header(t)}
          additionalRowProps={{
            token
          }}
          headerClassName={styles.tableHeader}
        />
      </BoxContent>
    </Box>
  );
};

export default SentStakes;
