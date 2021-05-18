import React, { useState, useEffect, useMemo } from 'react';

import TransactionPriority, { useTransactionFeeCalculation, useTransactionPriority } from '@shared/transactionPriority';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import { PrimaryButton, TertiaryButton } from '@toolbox/buttons';
import { Input } from '@toolbox/inputs';
import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';

import ProgressBar from '../progressBar';
import MemberField from './memberField';
import styles from './styles.css';

const token = tokenMap.LSK.key;
const MAX_MULTI_SIG_MEMBERS = 64;

const placeholderMember = {
  identifier: undefined, isMandatory: false,
};

const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

// eslint-disable-next-line max-statements
const Editor = ({
  t, account, nextStep,
}) => {
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [members, setMembers] = useState([placeholderMember]);
  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const [mandatoryKeys, optionalKeys] = useMemo(() => {
    const mandatory = members
      .filter(member => member.isMandatory && member.identifier)
      .map(member => member.identifier);

    const optional = members
      .filter(member => !member.isMandatory && member.identifier)
      .map(member => member.identifier);

    return [mandatory, optional];
  }, [members]);

  const { fee, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    token,
    account,
    priorityOptions,
    // numberOfSignatures: requiredSignatures,
    transaction: {
      moduleAssetId,
      nonce: account.sequence.nonce,
      senderPublicKey: account.summary.publicKey,
      optionalKeys,
      mandatoryKeys,
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
    const newMembers = [
      ...members.slice(0, index),
      newMember,
      ...members.slice(index + 1),
    ];
    setMembers(newMembers);
  };

  const deleteMember = (index) => {
    if (members.length === 1) {
      changeMember({ index, identifier: '', isMandatory: false });
    } else {
      const newMembers = [
        ...members.slice(0, index),
        ...members.slice(index + 1),
      ];
      setMembers(newMembers);
    }
  };

  const changeRequiredSignatures = (e) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setRequiredSignatures(value);
  };

  const goToNextStep = () => {
    const feeValue = customFee ? customFee.value : fee.value;
    nextStep({ fee: feeValue, mandatoryKeys, optionalKeys });
  };

  useEffect(() => {
    const difference = requiredSignatures - members.length;
    if (difference > 0) {
      const newMembers = new Array(difference).fill(placeholderMember);
      setMembers(prevMembers => [...prevMembers, ...newMembers]);
    }
  }, [requiredSignatures]);

  return (
    <section className={styles.wrapper}>
      <Box className={styles.box}>
        <header className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </header>
        <BoxContent className={styles.contentContainer}>
          <ProgressBar current={1} />
          <div>
            <span className={styles.requiredSignaturesHeading}>{t('Required Signatures')}</span>
            <Input
              className={`${styles.requiredSignaturesInput} multisignature-editor-input`}
              value={requiredSignatures ?? ''}
              onChange={changeRequiredSignatures}
              autoComplete="off"
              name="required-signatures"
            />
          </div>
          <div className={`${styles.membersControls} multisignature-members-controls`}>
            <span>Members</span>
            <TertiaryButton size="s" disabled={members.length >= 64} onClick={addMemberField} className="add-new-members">+ Add</TertiaryButton>
          </div>
          <div className={styles.contentScrollable}>
            {members.map((member, i) => (
              <MemberField
                key={i}
                t={t}
                {...member}
                index={i}
                showDeleteIcon={members.length > requiredSignatures}
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
          moduleAssetId={moduleAssetId}
          setCustomFee={setCustomFee}
          priorityOptions={priorityOptions}
          selectedPriority={selectedPriority.selectedIndex}
          setSelectedPriority={selectTransactionPriority}
          loadError={prioritiesLoadError}
          isLoading={loadingPriorities}
        />
        {
          feedback.error && <span className="feedback">{feedback.messages[0]}</span>
        }
        <BoxFooter>
          <PrimaryButton
            className="confirm-button"
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
