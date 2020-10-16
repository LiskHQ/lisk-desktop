import React, { useState } from 'react';

import Box from '../../../toolbox/box';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import TransactionPriority from '../../../shared/transactionPriority';
import { tokenMap } from '../../../../constants/tokens';
import useTransactionFeeCalculation from '../../send/form/useTransactionFeeCalculation';
import useTransactionPriority from '../../send/form/useTransactionPriority';

import styles from './styles.css';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '../../../toolbox/buttons';
import SteppedProgressBar from '../../../toolbox/steppedProgressBar/steppedProgressBar';
import Input from '../../../toolbox/inputs/input';
import Icon from '../../../toolbox/icon';
import DropdownButton from '../../../toolbox/dropdownButton';

const token = tokenMap.LSK.key;
const txType = 'createMultiSig';
const MAX_MULTI_SIG_MEMBERS = 64;


const placeholderMember = {
  identifier: undefined, isMandatory: false,
};

const InputWithDropdown = ({
  value, onChange, children, buttonLabel,
}) => (
  <div className={styles.inputWithDropdown}>
    <Input
      value={value}
      onChange={onChange}
      size="m"
      className={styles.inputDropdown}
    />
    <DropdownButton
      buttonClassName={styles.inputDropdownButton}
      buttonLabel={buttonLabel}
      size="s"
      ButtonComponent={SecondaryButton}
      align="right"
    >
      {children}
    </DropdownButton>
  </div>

);

const MemberField = ({
  t, index, identifier, isMandatory, onChangeMember, onDeleteMember,
}) => {
  const changeCategory = (flag) => {
    onChangeMember({ index, identifier, isMandatory: flag });
  };

  const changeIdentifier = (e) => {
    const newIdentifier = e.target.value;
    onChangeMember({ index, identifier: newIdentifier, isMandatory });
  };

  const deleteMember = () => onDeleteMember(index);

  return (
    <div className={styles.memberFieldContainer}>
      <InputWithDropdown
        t={t}
        value={identifier}
        onChange={changeIdentifier}
        buttonLabel={isMandatory ? t('Mandatory') : t('Optional')}
      >
        <span onClick={() => changeCategory(true)}>
          {t('Mandatory')}
        </span>
        <span onClick={() => changeCategory(false)}>
          {t('Optional')}
        </span>
      </InputWithDropdown>
      <span className={styles.deleteIcon} onClick={deleteMember}><Icon name="deleteIcon" /></span>
    </div>
  );
};

// eslint-disable-next-line max-statements
const Editor = ({
  t, account, nextStep,
}) => {
  const [requiredSignatures, setRequiredSignatures] = useState();
  const [members, setMembers] = useState([placeholderMember]);

  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    txData: {
      txType,
      nonce: account.nonce,
      senderPublicKey: account.publicKey,
      signatures: [], // no of signatures needed?
      // @todo create proper multi-sig tx
    },
  });

  //   const feedback = validateVotes(votes, account.balance, fee.value, t);
  const feedback = { error: false };
  const isCTADisabled = false;

  const addMemberField = () => {
    if (members.length < MAX_MULTI_SIG_MEMBERS) {
      setMembers(prevMembers => [...prevMembers, placeholderMember]);
    }
  };

  const changeMember = ({ index, identifier, isMandatory }) => {
    const newMember = { identifier, isMandatory };
    const newMembers = [...members.slice(0, index), newMember, ...members.slice(index + 1)];
    setMembers(newMembers);
  };

  const deleteMember = (index) => {
    if (members.length === 1) {
      changeMember({ index, identifier: '', isMandatory: false });
    } else {
      const newMembers = [...members.slice(0, index), ...members.slice(index + 1)];
      setMembers(newMembers);
    }
  };

  const goToNextStep = () => {
    const feeValue = customFee ? customFee.value : fee.value;
    nextStep({ fee: feeValue });
  };

  return (
    <section className={styles.wrapper}>
      <Box>
        <header className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </header>
        <BoxContent className={styles.contentContainer}>
          <SteppedProgressBar total={4} current={2} />
          <div>
            {t('Required Signatures')}
            <Input
              className={styles.requiredSignaturesInput}
              value={requiredSignatures}
              onChange={setRequiredSignatures}
              autoComplete="off"
              name="required-signatures"
            />
          </div>
          <div className={styles.membersContainer}>
            <span>Members</span>
            <TertiaryButton size="s" onClick={addMemberField}>+ Add</TertiaryButton>
          </div>

          <div className={styles.contentScrollable}>
            {members.map((member, i) => (
              <MemberField
                key={i}
                t={t}
                {...member}
                index={i}
                onChangeMember={changeMember}
                onDeleteMember={deleteMember}
              />
            ))}
          </div>
        </BoxContent>
        <TransactionPriority
          className={styles.txPriority}
          token={token}
          fee={fee}
          minFee={minFee.value}
          customFee={customFee ? customFee.value : undefined}
          txType={txType}
          setCustomFee={setCustomFee}
          priorityOptions={priorityOptions}
          selectedPriority={selectedPriority.selectedIndex}
          setSelectedPriority={selectTransactionPriority}
        />
        {
          feedback.error && <span className="feedback">{feedback.messages[0]}</span>
        }
        <BoxFooter>
          <PrimaryButton
            size="l"
            disabled={isCTADisabled}
            onClick={goToNextStep}
          >
            {t('Go to Confirmation')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Editor;
