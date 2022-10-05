import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectSearchParamValue, removeSearchParamsFromUrl } from 'src/utils/searchParams';
// import { tokenMap } from '@token/fungible/consts/tokens';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import BoxHeader from 'src/theme/box/header';
import BoxInfoText from 'src/theme/box/infoText';
import AmountField from 'src/modules/common/components/amountField';
import WalletVisual from 'src/modules/wallet/components/walletVisual';
// import TokenAmount from '@token/fungible/components/tokenAmount';
// import Converter from 'src/modules/common/components/converter';
import WarnPunishedDelegate from '@dpos/validator/components/WarnPunishedDelegate';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import { PrimaryButton, WarningButton } from 'src/theme/buttons';
import useVoteAmountField from '../../hooks/useVoteAmountField';
// import getMaxAmount from '../../utils/getMaxAmount';
import styles from './editVote.css';
import { useDelegates, useSentVotes } from '../../hooks/queries';
import { NUMBER_OF_BLOCKS_PER_DAY } from '../../consts';

const getTitles = (t) => ({
  edit: {
    title: t('Edit vote'),
    description: t(
      'Increase or decrease your vote amount, or remove your vote from this delegate. Your updated vote will be added to the voting queue.'
    ),
  },
  add: {
    title: t('Add to voting queue'),
    description: t(
      'Input your vote amount. This value shows how much trust you have in this delegate. '
    ),
  },
});

// eslint-disable-next-line max-statements
const EditVote = ({ history, voteEdited }) => {
  const { t } = useTranslation();
  const [
    {
      metadata: { address: currentAddress },
    },
  ] = useCurrentAccount();

  const [address, start, end] = selectSearchParamValue(history.location.search, [
    'address',
    'start',
    'end',
  ]);

  const { data: delegates, isLoading: isLoadingDelegates } = useDelegates({
    config: { params: { address: address || currentAddress } },
  });

  const delegate = useMemo(() => delegates?.data?.[0] || {}, [isLoadingDelegates]);

  const { data: blocks } = useBlocks({ config: { params: { limit: 1 } } });
  const currentHeight = useMemo(() => blocks?.data?.[0]?.height, [blocks]);

  const { data: sentVotes, isLoading: sentVotesLoading } = useSentVotes({
    config: { params: { address: currentAddress } },
  });

  const hasSentVoteToDelegate = useMemo(() => {
    const votes = sentVotes?.data?.votes;
    if (!votes) return false;

    return votes.some(({ delegateAddress }) => delegateAddress === address);
  }, [sentVotes]);

  const totalVoteAmount = useMemo(() => {
    if (!hasSentVoteToDelegate && !sentVotesLoading) return 0;

    const votes = sentVotes?.data?.votes;

    if (votes) {
      return votes.reduce(
        (total, { delegateAddress, amount }) =>
          delegateAddress === address ? total + amount : total,
        0
      );
    }

    return 0;
  }, [sentVotes]);

  const [voteAmount, setVoteAmount] = useVoteAmountField(
    hasSentVoteToDelegate ? fromRawLsk(totalVoteAmount) : ''
  );

  const mode = hasSentVoteToDelegate ? 'edit' : 'add';
  const [maxAmount /* setMaxAmount */] = useState(0);

  // useEffect(() => {
  //   getMaxAmount(wallet, network, voting, address || wallet.summary.address).then(setMaxAmount);
  // }, [wallet, voting]);

  const confirm = () => {
    voteEdited([
      {
        address: address || currentAddress,
        amount: toRawLsk(voteAmount.value),
      },
    ]);

    removeSearchParamsFromUrl(history, ['modal']);
  };

  const titles = getTitles(t)[mode];

  const removeVote = () => {
    voteEdited([
      {
        address: address || currentAddress,
        amount: 0,
      },
    ]);

    removeSearchParamsFromUrl(history, ['modal']);
  };

  const daysLeft = Math.ceil((parseInt(end, 10) - currentHeight) / NUMBER_OF_BLOCKS_PER_DAY);

  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box>
        <BoxHeader>
          <h1>{titles.title}</h1>
        </BoxHeader>
        <BoxContent className={styles.noPadding}>
          <BoxInfoText>
            <span>{titles.description}</span>
          </BoxInfoText>
          <BoxInfoText className={styles.accountInfo}>
            <WalletVisual size={40} address={address || currentAddress} />
            <p>{delegate.name}</p>
            <p>{delegate.address}</p>
          </BoxInfoText>
          {daysLeft >= 1 && start !== undefined && (
            <>
              <WarnPunishedDelegate pomHeight={{ start, end }} vote />
              <span className={styles.space} />
            </>
          )}
          <label className={styles.fieldGroup}>
            <AmountField
              amount={voteAmount}
              onChange={setVoteAmount}
              maxAmount={{ value: maxAmount }}
              displayConverter
              label={t('Vote amount (LSK)')}
              labelClassname={`${styles.fieldLabel}`}
              placeholder={t('Insert vote amount')}
              useMaxLabel={t('Use maximum amount')}
              name="vote"
            />
          </label>
        </BoxContent>
        <BoxFooter direction="horizontal">
          {mode === 'edit' && (
            <WarningButton className="remove-vote" onClick={removeVote}>
              {t('Remove vote')}
            </WarningButton>
          )}
          <PrimaryButton
            className={`${styles.confirmButton} confirm`}
            onClick={confirm}
            disabled={voteAmount.error}
          >
            {t('Confirm')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default EditVote;
