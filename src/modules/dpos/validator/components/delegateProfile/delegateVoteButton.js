import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DialogLink from 'src/theme/dialog/link';

import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import { useSentVotes } from '../../hooks/queries';

function DelegateVoteButton({ currentAddress, address, isBanned }) {
  const { t } = useTranslation();
  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address: currentAddress } },
  });

  const hasSentVoteToDelegate = useMemo(() => {
    if (!sentVotes?.data) return false;

    return sentVotes.data.votes.some(({ delegateAddress }) => delegateAddress === address);
  }, [sentVotes]);

  return hasSentVoteToDelegate ? (
    <DialogLink>
      <SecondaryButton disabled={sentVotesLoading || isBanned}>{t('Edit vote')}</SecondaryButton>
    </DialogLink>
  ) : (
    <DialogLink>
      <PrimaryButton disabled={sentVotesLoading || isBanned}>{t('Vote delegate')}</PrimaryButton>
    </DialogLink>
  );
}

export default DelegateVoteButton;
