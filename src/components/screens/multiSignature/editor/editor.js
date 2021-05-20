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
const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

const MAX_MULTI_SIG_MEMBERS = 64;

const placeholderMember = {
  address: undefined, isMandatory: false,
};

const getInitialMembersState = (prevState) => prevState.members ?? [placeholderMember];
const getInitialSignaturesState = (prevState) => prevState.numberOfSignatures ?? 2;

// const validateState = ({ mandatoryKeys, optionalKeys, requiredSignatures }) => {
//   if (requiredSignatures > MAX_MULTI_SIG_MEMBERS) {
//     return false;
//   }
//   if (requiredSignatures > mandatoryKeys.length + optionalKeys.length) {
//     return false;
//   }
//   return true;
// };

// eslint-disable-next-line max-statements
const Editor = ({
  t, account, nextStep, prevState,
}) => {
  const [requiredSignatures, setRequiredSignatures] = useState(() =>
    getInitialSignaturesState(prevState));
  const [members, setMembers] = useState(() => getInitialMembersState(prevState));

  const [customFee, setCustomFee] = useState();
  const [
    selectedPriority, selectTransactionPriority,
    priorityOptions, prioritiesLoadError, loadingPriorities,
  ] = useTransactionPriority(token);

  const [mandatoryKeys, optionalKeys] = useMemo(() => {
    const mandatory = members
      .filter(member => member.isMandatory && member.address)
      .map(member => member.address);

    const optional = members
      .filter(member => !member.isMandatory && member.address)
      .map(member => member.address);

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

  const addMemberField = () => {
    if (members.length < MAX_MULTI_SIG_MEMBERS) {
      setMembers(prevMembers => [...prevMembers, placeholderMember]);
    }
  };

  const changeMember = ({ index, address, isMandatory }) => {
    const newMember = { address, isMandatory };
    const newMembers = [
      ...members.slice(0, index),
      newMember,
      ...members.slice(index + 1),
    ];
    setMembers(newMembers);
  };

  const deleteMember = (index) => {
    if (members.length === 1) {
      changeMember({ index, address: '', isMandatory: false });
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
    nextStep({
      fee: feeValue, mandatoryKeys, optionalKeys, members, numberOfSignatures: requiredSignatures,
    });
  };

  useEffect(() => {
    const difference = requiredSignatures - members.length;
    if (difference > 0) {
      const newMembers = new Array(difference).fill(placeholderMember);
      setMembers(prevMembers => [...prevMembers, ...newMembers]);
    }
  }, [requiredSignatures]);

  // @todo
  // const feedback = { error: validateState({ mandatoryKeys, optionalKeys, requiredSignatures }) };
  // const isCTADisabled = feedback.error;
  const isCTADisabled = false;

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
            <span>{t('Members')}</span>
            <TertiaryButton
              size="s"
              disabled={members.length >= 64}
              onClick={addMemberField}
              className="add-new-members"
            >
              +
              {' '}
              {t('Add')}
            </TertiaryButton>
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
        {/* {
          feedback.error && <span className="feedback">{feedback.messages[0]}</span>
        } */}
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
