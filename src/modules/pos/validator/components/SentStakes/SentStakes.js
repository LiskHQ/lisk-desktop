import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from 'src/modules/common/components/Heading';
import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import StakesCount from '@pos/validator/components/StakesCount';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import styles from './SentStakes.css';
import header from './tableHeaderMap';
import SentStakesRow from '../SentStakesRow';
import { usePosConstants, useSentStakes, useUnlocks } from '../../hooks/queries';

function useStakerAddress(searchParam) {
  const searchAddress = selectSearchParamValue(searchParam, 'address');
  const [currentAccount] = useCurrentAccount();
  return searchAddress || currentAccount?.metadata?.address;
}

function ClaimRewardsDialogButton({ address }) {
  const { t } = useTranslation();
  const { data: rewardsClaimable } = useRewardsClaimable({ config: { params: { address } } });
  console.log('rewardsClaimable', rewardsClaimable);
  const hasClaimAbleRewards = rewardsClaimable?.meta?.total > 0;

  return (
    <DialogLink component="claimRewardsView">
      <SecondaryButton disabled={!hasClaimAbleRewards}>{t('Claim rewards')}</SecondaryButton>
    </DialogLink>
  );
}

function UnlockDialogButton({ address }) {
  const { t } = useTranslation();
  const { data: unlocks } = useUnlocks({ config: { params: { address } } });
  console.log('unlocks', unlocks);
  const hasUnlocks = unlocks?.data?.pendingUnlocks?.find((pendingUnlock) => pendingUnlock.unlockable);

  return (
    <DialogLink component="lockedBalance">
      <PrimaryButton disabled={hasUnlocks}>{t('Unlock stakes')}</PrimaryButton>
    </DialogLink>
  );
}

const SentStakes = ({ history }) => {
  const { t } = useTranslation();
  const stakerAddress = useStakerAddress(history.location.search);

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
            <StakesCount
              className={styles.stakesCountProp}
              address={stakerAddress}
            />
            <div className={styles.actionButtons}>
              <ClaimRewardsDialogButton address={stakerAddress} />
              <UnlockDialogButton address={stakerAddress} />
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          queryHook={useSentStakes}
          transformResponse={(resp) => resp?.stakes || []}
          queryConfig={{ config: { params: { address: stakerAddress } } }}
          row={SentStakesRow}
          header={header(t)}
          additionalRowProps={{
            token,
          }}
          headerClassName={styles.tableHeader}
        />
      </BoxContent>
    </Box>
  );
};

export default SentStakes;
