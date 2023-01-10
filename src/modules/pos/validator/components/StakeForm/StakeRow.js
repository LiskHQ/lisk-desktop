import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { tokenMap } from '@token/fungible/consts/tokens';
import { stakeEdited, stakeDiscarded } from 'src/redux/actions';
import { removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import { fromRawLsk, toRawLsk } from '@token/fungible/utils/lsk';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import Box from '@theme/box';
import { SecondaryButton, TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import AmountField from 'src/modules/common/components/amountField';
import useVoteAmountField from '../../hooks/useVoteAmountField';
import styles from './stakeForm.css';
import { extractValidatorCommission } from '../../utils';

const componentState = Object.freeze({ editing: 1, notEditing: 2 });
const token = tokenMap.LSK.key;

const StakeRow = ({
  t = (s) => s,
  data: { address, commission, username, confirmed, unconfirmed },
  index,
  history,
}) => {
  const [state, setState] = useState(
    unconfirmed === '' ? componentState.editing : componentState.notEditing
  );
  const dispatch = useDispatch();
  const [voteAmount, setVoteAmount] = useVoteAmountField(fromRawLsk(unconfirmed));
  const truncatedAddress = truncateAddress(address);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    dispatch(
      stakeEdited([
        {
          address,
          amount: toRawLsk(voteAmount.value),
        },
      ])
    );
    setState(componentState.notEditing);
  };

  const discard = () => {
    dispatch(stakeDiscarded({ address }));
  };

  const changeToEditingMode = () => {
    removeThenAppendSearchParamsToUrl(history, { modal: 'editStake', address }, ['modal, address']);
  };

  const changeToNotEditingMode = () => {
    setState(componentState.notEditing);
  };

  return (
    <Box className={styles.voteItemContainer}>
      <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
        <span className={styles.voteIndex}>{index + 1}.</span>
        <WalletVisual address={address} disabled={!unconfirmed} />
        <div className={styles.delegateInfo}>
          <span className={`${styles.delegateUsername} ${!unconfirmed ? styles.disabled : ''}`}>
            {username || ''}
          </span>
          <span className={styles.delegateAddress}>{truncatedAddress}</span>
        </div>
      </div>
      <span className={`${styles.oldAmountColumn} ${styles.centerContent}`}>
        {!!confirmed && <TokenAmount val={confirmed} token={token} />}
      </span>
      <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
          {extractValidatorCommission(commission)}%
      </span>
      {state === componentState.notEditing ? (
        <>
          <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
            {!!unconfirmed && <TokenAmount val={unconfirmed} token={token} />}
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
      ) : (
        <form
          className={`${styles.editStakeForm} ${styles.centerContent}`}
          onSubmit={handleFormSubmission}
        >
          <AmountField
            amount={voteAmount}
            onChange={setVoteAmount}
            displayConverter={false}
            placeHolder={t('Stake amount')}
            className={styles.editAmountInput}
            name="stake"
          />
          <div className={styles.formButtonsContainer}>
            <SecondaryButton
              size="s"
              className={styles.formButtons}
              onClick={changeToNotEditingMode}
            >
              {t('Cancel')}
            </SecondaryButton>
            <TertiaryButton size="s" className={styles.formButtons} onClick={handleFormSubmission}>
              {t('Save')}
            </TertiaryButton>
          </div>
        </form>
      )}
    </Box>
  );
};

export default StakeRow;
