import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { selectSearchParamValue, removeSearchParamsFromUrl } from '../../../utils/searchParams';
import { voteEdited } from '../../../actions/voting';
import Dialog from '../../toolbox/dialog/dialog';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import BoxInfoText from '../../toolbox/box/infoText';
import AmountField from '../../shared/amountField';
import useVoteAmountField from './useVoteAmountField';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons';
import { toRawLsk } from '../../../utils/lsk';

import styles from './editVote.css';

const getTitles = t => ({
  edit: {
    title: t('Edit vote'),
    description: t(''),
  },
  add: {
    title: t('Add to voting queue'),
    description: t('Input your vote weight. This value shows how much you trust in this delegate. You can’t use these tokens until you undo your vote.'),
  },
});

const AddVote = ({
  history, t,
}) => {
  const dispatch = useDispatch();
  const host = useSelector(state => state.account.info.LSK.address);
  const [voteAmount, setVoteAmount] = useVoteAmountField('');
  const mode = 'add';

  const confirm = () => {
    const address = selectSearchParamValue(history.location.search, 'address');
    dispatch(voteEdited([{
      address: address || host,
      amount: toRawLsk(voteAmount.value),
    }]));

    removeSearchParamsFromUrl(history, ['modal']);
  };

  const titles = getTitles(t)[mode];

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
          {
            mode === 'edit' && (
              <SecondaryButton className={`${styles.RemoveVoteButton} remove-vote`} onClick={removeVote}>
                {t('Remove vote')}
              </SecondaryButton>
            )
          }
          <PrimaryButton className={`${styles.confirmButton} confirm`} onClick={confirm}>
            {t('Confirm')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </Dialog>
  );
};

export default withRouter(withTranslation()(AddVote));
