import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DialogLink from 'src/theme/dialog/link';
import { selectStaking } from 'src/redux/selectors';

import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentStakes } from '../../hooks/queries';

function ValidatorStakeButton({ address, isBanned, currentAddress }) {
  const { t } = useTranslation();
  const voting = useSelector((state) => selectStaking(state));
  const { data: sentVotes, isLoading: sentVotesLoading } = useSentStakes({
    config: { params: { address } },
  });

  const stakeSentVoteToValidator = useMemo(() => {
    const votes = sentVotes?.data?.votes;
    if (!votes) return false;

    return votes.find(({ validatorAddress: vAddress }) => vAddress === address);
  }, [sentVotes, address, voting]);

  const isEdit = stakeSentVoteToValidator || voting[address];

  return (
    <DialogLink component="editStake">
      {isEdit ? (
        <SecondaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>
          {t('Edit stake')}
        </SecondaryButton>
      ) : (
        <PrimaryButton>
          {t('Stake validator')}
        </PrimaryButton>
      )}
    </DialogLink>
  );
}

export default ValidatorStakeButton;
