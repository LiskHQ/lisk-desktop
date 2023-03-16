import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { stakeEdited, stakeDiscarded } from 'src/redux/actions';
import { removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import { convertFromBaseDenom, convertToBaseDenom } from '@token/fungible/utils/helpers';
import { truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import Box from '@theme/box';
import { SecondaryButton, TertiaryButton } from '@theme/buttons';
import Icon from '@theme/Icon';
import TokenAmount from '@token/fungible/components/tokenAmount';
import AmountField from 'src/modules/common/components/amountField';
import useStakeAmountField from '../../hooks/useStakeAmountField';
import styles from './stakeForm.css';
import { convertCommissionToPercentage } from '../../utils';

const componentState = Object.freeze({ editing: 1, notEditing: 2 });

const StakeRow = ({
  t = (s) => s,
  data: { address, commission, username, confirmed, unconfirmed },
  index,
  history,
  token,
}) => {
  const [state, setState] = useState(
    unconfirmed === '' ? componentState.editing : componentState.notEditing
  );
  const dispatch = useDispatch();
  const [stakeAmount, setStakeAmount] = useStakeAmountField(
    convertFromBaseDenom(unconfirmed, token)
  );
  const truncatedAddress = truncateAddress(address);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    dispatch(
      stakeEdited([
        {
          address,
          amount: convertToBaseDenom(stakeAmount.value, token),
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
    <Box className={styles.stakeItemContainer}>
      <div className={`${styles.infoColumn} ${styles.validatorInfoContainer}`}>
        <span className={styles.stakeIndex}>{index + 1}.</span>
        <WalletVisual address={address} disabled={!unconfirmed} />
        <div className={styles.validatorInfo}>
          <span className={`${styles.validatorUsername} ${!unconfirmed ? styles.disabled : ''}`}>
            {username || ''}
          </span>
          <span className={styles.validatorAddress}>{truncatedAddress}</span>
        </div>
      </div>
      <span className={`${styles.commissionsColumn} ${styles.centerContent}`}>
        {convertCommissionToPercentage(commission)}%
      </span>
      {state === componentState.notEditing ? (
        <>
          <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
            {!!confirmed && (
              <span className={`${styles.oldAmountColumn}`}>
                <TokenAmount val={confirmed} token={token} />
              </span>
            )}
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
            token={token}
            amount={stakeAmount}
            onChange={setStakeAmount}
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
