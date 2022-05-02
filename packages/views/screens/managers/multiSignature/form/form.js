import React, { useState, useEffect, useMemo } from 'react';

import TransactionPriority from '@transaction/components/TransactionPriority';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';

import Box from '@basics/box';
import BoxContent from '@basics/box/content';
import BoxFooter from '@basics/box/footer';
import { PrimaryButton, TertiaryButton } from '@basics/buttons';
import { Input } from 'src/theme';
import { regex } from '@common/configuration';
import { tokenMap } from '@token/configuration/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { extractAddressFromPublicKey } from '@wallet/utilities/account';
import ProgressBar from '../progressBar';
import MemberField from './memberField';
import Feedback from './feedback';
import styles from './styles.css';

const token = tokenMap.LSK.key;
const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.registerMultisignatureGroup;

const MAX_MULTI_SIG_MEMBERS = 64;

const placeholderMember = {
  publicKey: undefined, isMandatory: true,
};

const getInitialMembersState = (prevState) => prevState.members ?? [placeholderMember];
const getInitialSignaturesState = (prevState) => prevState.numberOfSignatures ?? 2;

const validators = [
  {
    pattern: (_, optional) => optional.length === 1,
    message: t => t('Either change the optional member to mandatory or define more optional members.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length === 0 && optional.length === signatures,
    message: t => t('All members can not be optional. Consider changing them to mandatory.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length === 0 && signatures !== mandatory.length,
    message: t => t('Number of signatures must be equal to the number of members.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length > 0 && signatures <= mandatory.length,
    message: (t, mandatory) => t(t('Number of signatures must be above {{num}}.', { num: mandatory.length })),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length > 0
      && signatures === mandatory.length + optional.length,
    message: t => t('Either change the optional member to mandatory or reduce the number of signatures.'),
  },
  {
    pattern: (mandatory, optional, signatures) =>
      mandatory.length > 0 && optional.length > 0
      && signatures > mandatory.length + optional.length,
    message: (t, mandatory, optional) => t('Number of signatures must be lower than {{num}}.', { num: mandatory.length + optional.length }),
  },
  {
    pattern: (mandatory, optional) => mandatory.length + optional.length > MAX_MULTI_SIG_MEMBERS,
    message: t => t('Maximum number of members is {{MAX_MULTI_SIG_MEMBERS}}.', { MAX_MULTI_SIG_MEMBERS }),
  },
  {
    pattern: (mandatory, optional) =>
      mandatory.some(item => !regex.publicKey.test(item))
      || optional.some(item => !regex.publicKey.test(item)),
    message: t => t('Please enter a valid public key for each member.'),
  },
  {
    pattern: (mandatory, optional) => {
      const allKeys = mandatory.concat(optional);
      const keysMap = allKeys.reduce((result, key) => {
        result[key] = true;
        return result;
      }, {});

      return Object.keys(keysMap).length !== allKeys.length;
    },
    message: t => t('Duplicate public keys detected.'),
  },
];

export const validateState = ({
  mandatoryKeys, optionalKeys, requiredSignatures, t,
}) => {
  const messages = validators
    .map((scenario) => {
      if (scenario.pattern(mandatoryKeys, optionalKeys, requiredSignatures)) {
        return scenario.message(t, mandatoryKeys, optionalKeys);
      }
      return null;
    })
    .filter(item => !!item);

  return {
    error: (mandatoryKeys.length + optionalKeys.length) ? messages.length : -1,
    messages,
  };
};

// eslint-disable-next-line max-statements
const Editor = ({
  t, account, network, nextStep, prevState = {},
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
      .filter(member => member.isMandatory && member.publicKey)
      .map(member => member.publicKey)
      .sort();

    const optional = members
      .filter(member => !member.isMandatory && member.publicKey)
      .map(member => member.publicKey)
      .sort();

    return [mandatory, optional];
  }, [members]);

  const { fee, minFee } = useTransactionFeeCalculation({
    network,
    selectedPriority,
    token,
    wallet: account,
    priorityOptions,
    transaction: {
      moduleAssetId,
      nonce: account.sequence.nonce,
      senderPublicKey: account.summary.publicKey,
      optionalKeys,
      mandatoryKeys,
    },
  });

  const addMemberField = () => {
    if (members.length < MAX_MULTI_SIG_MEMBERS) {
      setMembers(prevMembers => [...prevMembers, placeholderMember]);
    }
  };

  const changeMember = ({ index, publicKey, isMandatory }) => {
    const newMember = { publicKey, isMandatory };
    const newMembers = [
      ...members.slice(0, index),
      newMember,
      ...members.slice(index + 1),
    ];
    setMembers(newMembers);
  };

  const deleteMember = (index) => {
    if (members.length === 1) {
      changeMember({ index, publicKey: '', isMandatory: false });
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
    const extractedMembers = members.map(member => {
      if (regex.publicKey.test(member.publicKey)) {
        return {
          ...member,
          address: extractAddressFromPublicKey(member.publicKey),
        };
      }
      return member;
    });

    nextStep({
      fee: feeValue,
      mandatoryKeys,
      optionalKeys,
      members: extractedMembers,
      numberOfSignatures: requiredSignatures,
    });
  };

  useEffect(() => {
    const difference = requiredSignatures - members.length;
    if (difference > 0) {
      const newMembers = new Array(difference).fill(placeholderMember);
      setMembers(prevMembers => [...prevMembers, ...newMembers]);
    }
  }, [requiredSignatures]);

  const feedback = useMemo(() => validateState({
    mandatoryKeys, optionalKeys, requiredSignatures, t,
  }), [mandatoryKeys, optionalKeys, requiredSignatures]);

  return (
    <section className={styles.wrapper}>
      <Box className={styles.box}>
        <header className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </header>
        <BoxContent className={styles.contentContainer}>
          <ProgressBar current={1} />
          <div>
            <span className={styles.requiredSignaturesHeading}>{t('Required signatures')}</span>
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
          minFee={Number(minFee.value)}
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
          feedback.error > 0 && <Feedback messages={feedback.messages} />
        }
        <BoxFooter>
          <PrimaryButton
            className="confirm-button"
            size="l"
            disabled={feedback.error !== 0}
            onClick={goToNextStep}
          >
            {t('Go to confirmation')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    </section>
  );
};

export default Editor;
