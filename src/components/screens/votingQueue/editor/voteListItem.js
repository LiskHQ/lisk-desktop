import React, { useState } from 'react';
import AccountVisual from '../../../toolbox/accountVisual';
import Box from '../../../toolbox/box';
import { SecondaryButton, TertiaryButton } from '../../../toolbox/buttons';
import Icon from '../../../toolbox/icon';
import { Input } from '../../../toolbox/inputs';

import styles from './editor.css';

const ComponentState = Object.freeze({ editing: 1, notEditing: 2 });

const VoteListItem = ({
  t = s => s, address, username, oldAmount, newAmount, setVoteAmount, deleteVote,
}) => {
  const [state, setState] = useState(ComponentState.notEditing);
  const [inputValue, setInputValue] = useState();

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setVoteAmount(inputValue);
    setState(ComponentState.notEditing);
  };

  const changeToEditingMode = () => {
    setState(ComponentState.editing);
  };

  const changeToNotEditingMode = () => {
    setState(ComponentState.notEditing);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const inputError = false;

  return (
    <Box className={styles.voteItemContainer}>
      <div className={`${styles.infoColumn} ${styles.delegateInfoContainer}`}>
        <AccountVisual address={address} />
        <div className={styles.delegateInfo}>
          <span className={styles.delegateAddress}>{address}</span>
          <span className={styles.delegateUsername}>{username}</span>
        </div>
      </div>
      <span className={`${styles.oldAmountColumn} ${styles.centerContent}`}>
        {`${oldAmount} LSK`}
      </span>
      {state === ComponentState.notEditing
        ? (
          <>
            <span className={`${styles.newAmountColumn} ${styles.centerContent}`}>
              {`${newAmount} LSK`}
            </span>
            <div className={`${styles.editIconsContainer} ${styles.centerContent}`}>
              <span onClick={changeToEditingMode}>
                <Icon name="edit" className={styles.editIcon} />
              </span>
              <span onClick={deleteVote}>
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
            <Input
              size="m"
              value={inputValue}
              onChange={handleInputChange}
              error={inputError}
              className={styles.editAmountInput}
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
        )
      }
    </Box>
  );
};

export default VoteListItem;
