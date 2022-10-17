import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DialogLink from 'src/theme/dialog/link';

import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentVotes } from '../../hooks/queries';

function DelegateVoteButton({ address, isBanned, currentAddress }) {
  const { t } = useTranslation();
  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address } },
  });

  const hasSentVoteToDelegate = useMemo(() => {
    if (!sentVotes?.data) return false;

    return sentVotes.data?.votes?.some?.(({ delegateAddress }) => delegateAddress === address);
  }, [sentVotes]);

  return (
    <DialogLink component="editVote">
      {hasSentVoteToDelegate ? (
        <SecondaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>{t('Edit vote')}</SecondaryButton>
      ) : (
        <PrimaryButton disabled={sentVotesLoading || isBanned || !currentAddress}>{t('Vote delegate')}</PrimaryButton>
      )}
    </DialogLink>
  );
}

export default DelegateVoteButton;
