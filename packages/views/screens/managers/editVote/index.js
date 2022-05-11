import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector, connect } from 'react-redux';
import { compose } from 'redux';

import {
  selectSearchParamValue,
  removeSearchParamsFromUrl,
} from 'src/utils/searchParams';
import { tokenMap } from '@token/fungible/consts/tokens';
import { voteEdited } from '@common/store/actions';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import Dialog from 'src/theme/dialog/dialog';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import BoxHeader from 'src/theme/box/header';
import BoxInfoText from 'src/theme/box/infoText';
import AmountField from 'src/modules/common/components/amountField';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Converter from 'src/modules/common/components/converter';
import WarnPunishedDelegate from '@dpos/validator/components/WarnPunishedDelegate';
import { selectActiveTokenAccount, selectNetwork, selectVoting } from '@common/store';
import { PrimaryButton, WarningButton } from 'src/theme/buttons';
import useVoteAmountField from './useVoteAmountField';
import getMaxAmount from './getMaxAmount';
import styles from './editVote.css';

const mapStateToProps = (state) => ({
  currentHeight: state.blocks.latestBlocks.length
    ? state.blocks.latestBlocks[0].height
    : 0,
});

const getTitles = (t) => ({
  edit: {
    title: t('Edit vote'),
    description: t(
      'Increase or decrease your vote amount, or remove your vote from this delegate. Your updated vote will be added to the voting queue.',
    ),
  },
  add: {
    title: t('Add vote'),
    description: t(
      'Insert a vote amount for this delegate. Your new vote will be added to the voting queue.',
    ),
  },
});

// eslint-disable-next-line max-statements
const AddVote = ({ history, t, currentHeight }) => {
  const dispatch = useDispatch();
  const { account } = useSelector(selectActiveTokenAccount);
  const { network } = useSelector(selectNetwork);
  const { voting } = useSelector(selectVoting);

  const [address, start, end] = selectSearchParamValue(history.location.search, ['address', 'start', 'end']);
  const existingVote = useSelector((state) => state.voting[address || account.summary.address]);
  const [voteAmount, setVoteAmount] = useVoteAmountField(
    existingVote ? fromRawLsk(existingVote.unconfirmed) : '',
  );
  const mode = existingVote ? 'edit' : 'add';
  const [maxAmount, setMaxAmount] = useState(0);
  useEffect(() => {
    getMaxAmount(account, network, voting, address || account.summary.address).then(
      setMaxAmount,
    );
  }, [account, voting]);

  const confirm = () => {
    dispatch(
      voteEdited([
        {
          address: address || account.summary.address,
          amount: toRawLsk(voteAmount.value),
        },
      ]),
    );

    removeSearchParamsFromUrl(history, ['modal']);
  };

  const titles = getTitles(t)[mode];

  const removeVote = () => {
    dispatch(
      voteEdited([
        {
          address: address || account.summary.address,
          amount: 0,
        },
      ]),
    );

    removeSearchParamsFromUrl(history, ['modal']);
  };

  // 6: blocks per minute, 60: minutes, 24: hours
  const numOfBlockPerDay = 24 * 60 * 6;
  const daysLeft = Math.ceil(
    (parseInt(end, 10) - currentHeight) / numOfBlockPerDay,
  );

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
          <BoxInfoText className={styles.walletInfo}>
            <p className={styles.balanceTitle}>
              {t('Available balance for voting')}
            </p>
            <div className={styles.balanceDetails}>
              <span className={styles.lskValue}>
                <TokenAmount val={maxAmount} token={tokenMap.LSK.key} />
              </span>
              <Converter
                className={styles.fiatValue}
                value={fromRawLsk(maxAmount)}
                error=""
              />
            </div>
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
              useMaxWarning={t(
                'Caution! You are about to send the majority of your balance',
              )}
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

export default compose(
  withRouter,
  connect(mapStateToProps),
  withTranslation(),
)(AddVote);
