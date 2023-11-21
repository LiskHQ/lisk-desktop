import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DialogLink from 'src/theme/dialog/link';
import { selectStaking } from 'src/redux/selectors';
import { useValidateFeeBalance } from '@token/fungible/hooks/queries/useValidateFeeBalance';
import { getTokenBalanceErrorMessage } from 'src/modules/common/utils/getTokenBalanceErrorMessage';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentStakes } from '../../hooks/queries';

function ValidatorStakeButton({ address, isBanned, currentAddress, isDisabled, hasTokenBalance }) {
  const { t } = useTranslation();
  const staking = useSelector((state) => selectStaking(state));
  const { data: sentStakes, isLoading: sentStakesLoading } = useSentStakes({
    config: { params: { address: currentAddress } },
  });

  const validatorStake = useMemo(() => {
    const stakes = sentStakes?.data?.stakes;
    if (!stakes) return false;

    return stakes.find(({ address: validatorAddress }) => validatorAddress === address);
  }, [sentStakes, address, staking]);

  const isEdit = validatorStake || staking[address];

  const { hasSufficientBalanceForFee, feeToken } = useValidateFeeBalance();

  return (
    <DialogLink
      data={{
        validatorAddress: address,
        ...getTokenBalanceErrorMessage({
          errorType: 'stakeValidator',
          hasSufficientBalanceForFee,
          feeTokenSymbol: feeToken?.symbol,
          hasAvailableTokenBalance: hasTokenBalance,
          t,
        }),
      }}
      component={hasTokenBalance && hasSufficientBalanceForFee ? 'editStake' : 'noTokenBalance'}
    >
      {isEdit ? (
        <SecondaryButton disabled={sentStakesLoading || isBanned || !currentAddress || isDisabled}>
          {t('Edit stake')}
        </SecondaryButton>
      ) : (
        <PrimaryButton disabled={isDisabled || isBanned || sentStakesLoading}>
          {t('Stake validator')}
        </PrimaryButton>
      )}
    </DialogLink>
  );
}

export default ValidatorStakeButton;
