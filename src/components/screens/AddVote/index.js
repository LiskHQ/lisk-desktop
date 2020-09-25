import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectSearchParamValue, removeSearchParamsFromUrl } from '../../../utils/searchParams';
import { voteEdited, votesSubmitted } from '../../../actions/voting';
import { transactionBroadcasted } from '../../../actions/transactions';
import Dialog from '../../toolbox/dialog/dialog';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import BoxInfoText from '../../toolbox/box/infoText';
import AmountField from '../../shared/amountField';
import useVoteAmountField from './useVoteAmountField';
import { PrimaryButton } from '../../toolbox/buttons';
import { toRawLsk } from '../../../utils/lsk';

import styles from './addVote.css';

const AddVote = ({
  history, t,
}) => {
  const account = useSelector(state => state.account);
  const { transactionsCreated } = useSelector(state => state.transactions);
  const dispatch = useDispatch();
  const host = useSelector(state => state.account.info.LSK.address);
  const [voteAmount, setVoteAmount] = useVoteAmountField('');

  const confirm = () => {
    const address = selectSearchParamValue(history.location.search, 'address');
    dispatch(voteEdited([{
      address: address || host,
      amount: toRawLsk(voteAmount.value),
    }]));

    // removeSearchParamsFromUrl(history, ['modal']);
    dispatch(votesSubmitted({
      votes: [{
        delegateAddress: address || host,
        amount: `-${toRawLsk(voteAmount.value).toString()}`,
      }],
      fee: '100000000',
      nonce: account.info.LSK.nonce,
      senderPublicKey: account.info.LSK.publicKey,
      passphrase: account.passphrase,
    }));
  };
  useEffect(() => {
    if (transactionsCreated.length) {
      dispatch(transactionBroadcasted(transactionsCreated[0]));
    }
  }, [transactionsCreated.length]);

  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box>
        <BoxHeader>
          <h1>{t('Add to voting queue')}</h1>
        </BoxHeader>
        <BoxContent className={styles.noPadding}>
          <BoxInfoText>
            <span>{t('Input your vote weight. This value shows how much you trust in this delegate. You can’t use these tokens until you undo your vote.')}</span>
          </BoxInfoText>
          <label className={styles.fieldGroup}>
            <AmountField
              amount={voteAmount}
              setAmountField={setVoteAmount}
              title={t('Vote amount (LSK)')}
              inputPlaceHolder={t('Insert the vote amount')}
              name="vote"
            />
          </label>
        </BoxContent>
        <BoxFooter direction="horizontal">
          <PrimaryButton className={`${styles.confirmButton} confirm`} onClick={confirm}>
            {t('Confirm')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default withRouter(withTranslation()(AddVote));
