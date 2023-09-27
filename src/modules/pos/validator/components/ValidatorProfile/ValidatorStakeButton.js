import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DialogLink from 'src/theme/dialog/link';
import { selectStaking } from 'src/redux/selectors';

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

  return (
    <DialogLink
      data={{ message: t('Token balance is not enough to stake a validator.') }}
      component={hasTokenBalance ? 'editStake' : 'noTokenBalance'}
    >
      {isEdit ? (
        <SecondaryButton disabled={sentStakesLoading || isBanned || !currentAddress || isDisabled}>
          {t('Edit stake')}
        </SecondaryButton>
      ) : (
        <PrimaryButton disabled={isDisabled || isBanned}>{t('Stake validator')}</PrimaryButton>
      )}
    </DialogLink>
  );
}

export default ValidatorStakeButton;
