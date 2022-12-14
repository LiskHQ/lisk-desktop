import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DialogLink from 'src/theme/dialog/link';
import { selectVoting } from 'src/redux/selectors';

import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentVotes } from '../../hooks/queries';

function ValidatorVoteButton({ address, isBanned, currentAddress }) {
  const { t } = useTranslation();
  const voting = useSelector((state) => selectVoting(state));
  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address } },
  });

  const voteSentVoteToValidator = useMemo(() => {
    const votes = sentVotes?.data?.votes;
    if (!votes) return false;

    return votes.find(({ delegateAddress: dAddress }) => dAddress === address);
  }, [sentVotes, address, voting]);

  const isEdit = voteSentVoteToValidator || voting[address];

  return (
    <DialogLink component="editVote">
      {isEdit ? (
        <SecondaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>
          {t('Edit vote')}
        </SecondaryButton>
      ) : (
        <PrimaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>
          {t('Stake validator')}
        </PrimaryButton>
      )}
    </DialogLink>
  );
}

export default ValidatorVoteButton;
