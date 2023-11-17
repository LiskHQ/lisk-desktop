import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '@common/components/Heading';
import DialogLink from 'src/theme/dialog/link';
import Box from 'src/theme/box';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import { QueryTable } from 'src/theme/QueryTable';
import BoxHeader from 'src/theme/box/header';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useCurrentAccount } from '@account/hooks';
import routes from 'src/routes/routes';
import StakesCount from '@pos/validator/components/StakesCount';
import { useRewardsClaimable } from '@pos/reward/hooks/queries';
import { useMyTransactions } from '@transaction/hooks/queries';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import Badge from '@common/components/badge';
import { useValidateFeeBalance } from '@token/fungible/hooks/queries/useValidateFeeBalance';
import { INSUFFICENT_TOKEN_BALANCE_MESSAGE } from 'src/modules/common/constants';
import styles from './SentStakes.css';
import header from './tableHeaderMap';
import SentStakesRow from '../SentStakesRow';
import { useSentStakes, useUnlocks } from '../../hooks/queries';
import usePosToken from '../../hooks/usePosToken';

function useStakerAddress(searchParam) {
  const searchAddress = selectSearchParamValue(searchParam, 'address');
  const isModal = !!selectSearchParamValue(searchParam, 'modal');
  const [currentAccount] = useCurrentAccount();
  return !isModal && searchAddress ? searchAddress : currentAccount?.metadata?.address;
}

function ClaimRewardsDialogButton({ address }) {
  const { t } = useTranslation();
  const { data: rewardsClaimable } = useRewardsClaimable({ config: { params: { address } } });
  const { hasSufficientBalanceForFee, feeToken } = useValidateFeeBalance();

  const getInSufficientBalanceMessage = () => {
    if (!hasSufficientBalanceForFee) {
      return {
        message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.fees(feeToken?.symbol),
      };
    }

    return {};
  };
  const hasClaimableRewards =
    rewardsClaimable?.data?.length &&
    rewardsClaimable?.data?.reduce((acc, curr) => BigInt(curr.reward) + acc, BigInt(0)) > BigInt(0);

  return (
    <DialogLink
      data={{ ...getInSufficientBalanceMessage() }}
      component={hasSufficientBalanceForFee ? 'claimRewardsView' : 'noTokenBalance'}
    >
      <SecondaryButton disabled={!hasClaimableRewards}>
        {t('Claim rewards')}
        {!!hasClaimableRewards && <Badge />}
      </SecondaryButton>
    </DialogLink>
  );
}

function UnlockDialogButton({ hasUnlocks }) {
  const { t } = useTranslation();

  const { hasSufficientBalanceForFee, feeToken } = useValidateFeeBalance();

  const getInSufficientBalanceMessage = () => {
    if (!hasSufficientBalanceForFee) {
      return {
        message: INSUFFICENT_TOKEN_BALANCE_MESSAGE.fees(feeToken?.symbol),
      };
    }

    return {};
  };

  return (
    <DialogLink
      data={{ ...getInSufficientBalanceMessage() }}
      component={hasSufficientBalanceForFee ? 'lockedBalance' : 'noTokenBalance'}
    >
      <PrimaryButton disabled={!hasUnlocks}>{t('Unlock stakes')}</PrimaryButton>
    </DialogLink>
  );
}

const SentStakes = ({ history }) => {
  const { t } = useTranslation();
  const stakerAddress = useStakerAddress(history.location.search);
  const { token } = usePosToken({ address: stakerAddress });
  const sentStakes = useSentStakes({
    config: { params: { address: stakerAddress } },
  });
  const unlocks = useUnlocks({ config: { params: { address: stakerAddress } } });
  const { data: pooledTransactionsData } = useMyTransactions({
    config: {
      params: {
        address: stakerAddress,
        sort: 'timestamp:desc',
        moduleCommand: MODULE_COMMANDS_NAME_MAP.stake,
        limit: 1,
      },
    },
  });

  const hasUnlocks = unlocks?.data?.data?.pendingUnlocks?.length > 0;

  useEffect(() => {
    if (pooledTransactionsData?.meta?.total > 1) {
      sentStakes.refetch();
      unlocks.refetch();
    }
  }, [pooledTransactionsData?.meta?.total]);

  const handleGoToValidators = () => {
    history.push(routes.validators.path);
  };

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <Heading title={t('Stakes')} onGoBack={handleGoToValidators}>
          <div className={styles.rightHeaderSection}>
            <StakesCount className={styles.stakesCountProp} address={stakerAddress} />
            <div className={styles.actionButtons}>
              <ClaimRewardsDialogButton address={stakerAddress} />
              <UnlockDialogButton hasUnlocks={hasUnlocks} />
            </div>
          </div>
        </Heading>
      </BoxHeader>
      <BoxContent>
        <QueryTable
          showHeader
          queryHook={useSentStakes}
          transformResponse={(resp) =>
            resp?.stakes.sort((a, b) => (b.address < a.address ? 1 : -1)) || []
          }
          queryConfig={{ config: { params: { address: stakerAddress } } }}
          row={SentStakesRow}
          header={header(t)}
          additionalRowProps={{
            token,
          }}
          headerClassName={styles.tableHeader}
          emptyState={{
            illustration: 'emptyTransactionsIllustration',
            message: 'There are no stakes for this account.',
          }}
        />
      </BoxContent>
    </Box>
  );
};

export default SentStakes;
