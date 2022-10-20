import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DialogLink from 'src/theme/dialog/link';
import { selectVoting } from 'src/redux/selectors';
import { useSelector } from 'react-redux';

import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentVotes } from '../../hooks/queries';

function DelegateVoteButton({ address, isBanned, currentAddress }) {
  const { t } = useTranslation();
  const voting = useSelector((state) => selectVoting(state));
  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address } },
  });

  const voteSentVoteToDelegate = useMemo(() => {
    const votes = sentVotes?.data?.votes;
    if (!votes) return false;

    return votes.find(({ delegateAddress: dAddress }) => dAddress === address);
  }, [sentVotes, address, voting]);

  const isEdit = voteSentVoteToDelegate || voting[address];

  return (
    <DialogLink component="editVote">
      {isEdit ? (
        <SecondaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>{t('Edit vote')}</SecondaryButton>
      ) : (
        <PrimaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>{t('Vote delegate')}</PrimaryButton>
      )}
    </DialogLink>
  );
}

export default DelegateVoteButton;
