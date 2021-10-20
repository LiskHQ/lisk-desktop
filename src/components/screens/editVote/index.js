import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { selectSearchParamValue, removeSearchParamsFromUrl } from '@utils/searchParams';
import { tokenMap } from '@constants';
import { voteEdited } from '@actions';
import { selectAccountBalance } from '@store/selectors';
import { toRawLsk, fromRawLsk } from '@utils/lsk';
import Dialog from '@toolbox/dialog/dialog';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import BoxHeader from '@toolbox/box/header';
import BoxInfoText from '@toolbox/box/infoText';
import AmountField from '@shared/amountField';
import LiskAmount from '@shared/liskAmount';
import Converter from '@shared/converter';
import { PrimaryButton, WarningButton } from '@toolbox/buttons';
import useVoteAmountField from './useVoteAmountField';

import styles from './editVote.css';

const getTitles = t => ({
  edit: {
    title: t('Edit vote'),
    description: t('Increase or decrease your vote amount, or remove your vote from this delegate. Your updated vote will be added to the voting queue.'),
  },
  add: {
    title: t('Add vote'),
    description: t('Insert a vote amount for this delegate. Your new vote will be added to the voting queue.'),
  },
});

// eslint-disable-next-line max-statements
const AddVote = ({
  history, t,
}) => {
  const dispatch = useDispatch();
  const host = useSelector(state => state.account.info.LSK.summary.address);
  const address = selectSearchParamValue(history.location.search, 'address');
  const existingVote = useSelector(state => state.voting[address || host]);
  const activeToken = tokenMap.LSK.key;
  const balance = useSelector(selectAccountBalance);
  const [voteAmount, setVoteAmount] = useVoteAmountField(existingVote ? fromRawLsk(existingVote.unconfirmed) : '', balance);
  const mode = existingVote ? 'edit' : 'add';

  const confirm = () => {
    dispatch(voteEdited([{
      address: address || host,
      amount: toRawLsk(voteAmount.value),
    }]));

    removeSearchParamsFromUrl(history, ['modal']);
  };

  const titles = getTitles(t)[mode];

  const removeVote = () => {
    dispatch(voteEdited([{
      address: address || host,
      amount: 0,
    }]));

    removeSearchParamsFromUrl(history, ['modal']);
  };

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
            <p className={styles.balanceTitle}>Available balance</p>
            <div className={styles.balanceDetails}>
              <span className={styles.lskValue}>
                <LiskAmount val={balance} token={activeToken} />
              </span>
              <Converter
                className={styles.fiatValue}
                value={fromRawLsk(balance)}
                error=""
              />
            </div>
          </BoxInfoText>
          <label className={styles.fieldGroup}>
            <AmountField
              amount={voteAmount}
              setAmountField={setVoteAmount}
              title={t('Vote amount (LSK)')}
              inputPlaceHolder={t('Insert vote amount')}
              name="vote"
              displayConverter
            />
          </label>
        </BoxContent>
        <BoxFooter direction="horizontal">
          {
            mode === 'edit' && (
              <WarningButton className="remove-vote" onClick={removeVote}>
                {t('Remove vote')}
              </WarningButton>
            )
          }
          <PrimaryButton className={`${styles.confirmButton} confirm`} onClick={confirm} disabled={voteAmount.error}>
            {t('Confirm')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default withRouter(withTranslation()(AddVote));
