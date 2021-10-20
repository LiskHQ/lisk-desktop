import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { tokenMap } from '@constants';
import { voteEdited } from '@actions';
import { selectAccountBalance } from '@store/selectors';
import { fromRawLsk, toRawLsk } from '@utils/lsk';
import { truncateAddress } from '@utils/account';
import AccountVisual from '@toolbox/accountVisual';
import Box from '@toolbox/box';
import { SecondaryButton, TertiaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import LiskAmount from '@shared/liskAmount';
import AmountField from '@shared/amountField';
import useVoteAmountField from '../../editVote/useVoteAmountField';
import styles from './editor.css';

const ComponentState = Object.freeze({ editing: 1, notEditing: 2 });
const token = tokenMap.LSK.key;

const VoteRow = ({
  t = s => s, data: {
    address, username, confirmed, unconfirmed,
  },
}) => {
  const [state, setState] = useState(unconfirmed === '' ? ComponentState.editing : ComponentState.notEditing);
  const dispatch = useDispatch();
  const balance = useSelector(selectAccountBalance);
  const [voteAmount, setVoteAmount] = useVoteAmountField(fromRawLsk(unconfirmed), balance);
  const truncatedAddress = truncateAddress(address);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    dispatch(voteEdited([{
      address,
      amount: toRawLsk(voteAmount.value),
    }]));
    setState(ComponentState.notEditing);
  };

  const discard = () => {
    dispatch(voteEdited([{
      address,
      amount: confirmed,
    }]));
  };

  const changeToEditingMode = () => {
    setState(ComponentState.editing);
  };

  const changeToNotEditingMode = () => {
    setState(ComponentState.notEditing);
  };

  return (
    <Box className={styles.voteItemContainer}>
      <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
        <AccountVisual address={address} />
        <div className={styles.delegateInfo}>
          <span className={styles.delegateUsername}>{username || ''}</span>
          <span className={styles.delegateAddress}>{truncatedAddress}</span>
        </div>
      </div>
      <span className={`${styles.oldAmountColumn} ${styles.centerContent}`}>
        <LiskAmount val={confirmed} token={token} />
      </span>
      {state === ComponentState.notEditing
        ? (
          <>
            <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
              <LiskAmount val={unconfirmed} token={token} />
            </span>
            <div className={`${styles.editIconsContainer} ${styles.centerContent}`}>
              <span onClick={changeToEditingMode}>
                <Icon name="edit" className={styles.editIcon} />
              </span>
              <span onClick={discard}>
                <Icon name="deleteIcon" className={styles.editIcon} />
              </span>
            </div>
          </>
        )
        : (
          <form
            className={`${styles.editVoteForm} ${styles.centerContent}`}
            onSubmit={handleFormSubmission}
          >
            <AmountField
              amount={voteAmount}
              setAmountField={setVoteAmount}
              inputPlaceHolder={t('Vote amount')}
              name="vote"
              className={styles.editAmountInput}
              displayConverter={false}
            />
            <div className={styles.formButtonsContainer}>
              <SecondaryButton
                size="s"
                className={styles.formButtons}
                onClick={changeToNotEditingMode}
              >
                {t('Cancel')}
              </SecondaryButton>
              <TertiaryButton
                size="s"
                className={styles.formButtons}
                onClick={handleFormSubmission}
              >
                {t('Save')}
              </TertiaryButton>
            </div>
          </form>
        )}
    </Box>
  );
};

export default VoteRow;
