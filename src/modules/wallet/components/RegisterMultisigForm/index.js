import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { TertiaryButton } from 'src/theme/buttons';
import { Input } from 'src/theme';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import TxComposer from '@transaction/components/TxComposer';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import { MAX_MULTI_SIG_MEMBERS } from '../../configuration/constants';
import MemberField from './MemberField';
import validators from './validators';
import styles from './styles.css';

const placeholderMember = {
  publicKey: undefined,
  isMandatory: true,
};

const getInitialMembersState = (prevState) => {
  if (prevState.rawTx) {
    return [
      ...prevState.rawTx.params.mandatoryKeys.map((item) => ({
        isMandatory: true,
        publicKey: item,
      })),
      ...prevState.rawTx.params.optionalKeys.map((item) => ({
        isMandatory: false,
        publicKey: item,
      })),
    ];
  }

  return [];
};
const getInitialSignaturesState = (prevState) => prevState.numberOfSignatures ?? 2;

export const validateState = ({ mandatoryKeys, optionalKeys, numberOfSignatures, t }) => {
  const messages = validators
    .map((scenario) => {
      if (scenario.pattern(mandatoryKeys, optionalKeys, numberOfSignatures)) {
        return scenario.message(t, mandatoryKeys, optionalKeys);
      }
      return null;
    })
    .filter((item) => !!item);

  const hasError = mandatoryKeys.length + optionalKeys.length > 0;
  return {
    error: hasError ? messages.length : -1,
    messages,
  };
};

// eslint-disable-next-line max-statements
const Form = ({ nextStep, prevState = {} }) => {
  const { t } = useTranslation();
  const [numberOfSignatures, setNumberOfSignatures] = useState(() =>
    getInitialSignaturesState(prevState)
  );
  const [members, setMembers] = useState(() => getInitialMembersState(prevState));

  const [currentApplication] = useCurrentApplication();
  const { data: tokens } = useTokensBalance(currentApplication)
  const defaultToken = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const [mandatoryKeys, optionalKeys] = useMemo(() => {
    const mandatory = members
      .filter((member) => member.isMandatory && member.publicKey)
      .map((member) => member.publicKey)
      .sort();

    const optional = members
      .filter((member) => !member.isMandatory && member.publicKey)
      .map((member) => member.publicKey)
      .sort();

    return [mandatory, optional];
  }, [members]);

  const addMemberField = () => {
    if (members.length < MAX_MULTI_SIG_MEMBERS) {
      setMembers((prevMembers) => [...prevMembers, placeholderMember]);
    }
  };

  const changeMember = ({ index, publicKey, isMandatory }) => {
    const newMember = { publicKey, isMandatory };
    const newMembers = [...members.slice(0, index), newMember, ...members.slice(index + 1)];
    setMembers(newMembers);
  };

  const deleteMember = (index) => {
    if (members.length === 1) {
      changeMember({ index, publicKey: '', isMandatory: false });
    } else {
      const newMembers = [...members.slice(0, index), ...members.slice(index + 1)];
      setMembers(newMembers);
    }
  };

  const changeNumberOfSignatures = (e) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setNumberOfSignatures(value);
  };

  const onConfirm = (formProps, transactionJSON) => {
    nextStep({ formProps, transactionJSON });
  };

  useEffect(() => {
    const difference = numberOfSignatures - members.length;
    if (difference > 0) {
      const newMembers = new Array(difference).fill(placeholderMember);
      setMembers((prevMembers) => [...prevMembers, ...newMembers]);
    }
  }, [numberOfSignatures]);

  const feedback = useMemo(
    () =>
      validateState({
        mandatoryKeys,
        optionalKeys,
        numberOfSignatures,
        t,
      }),
    [mandatoryKeys, optionalKeys, numberOfSignatures]
  );

  const multisignatureFormProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.registerMultisignature,
    isValid: feedback.error === 0,
    feedback: feedback.messages,
    fields: {
      token: defaultToken,
    },
  };
  const commandParams = {
    mandatoryKeys,
    optionalKeys,
    numberOfSignatures,
    signatures: [],
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        formProps={multisignatureFormProps}
        commandParams={commandParams}
        onConfirm={onConfirm}
        buttonTitle={t('Go to confirmation')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Register multisignature account')}</h2>
          </BoxHeader>
          <BoxContent className={styles.container}>
            <ProgressBar current={1} />
            <div>
              <span className={styles.numberOfSignaturesHeading}>{t('Required signatures')}</span>
              <Input
                className={`${styles.numberOfSignaturesInput} multisignature-editor-input`}
                value={numberOfSignatures}
                onChange={changeNumberOfSignatures}
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
                + {t('Add')}
              </TertiaryButton>
            </div>
            <div className={styles.contentScrollable}>
              {members.map((member, i) => (
                <MemberField
                  key={i}
                  t={t}
                  {...member}
                  index={i}
                  showDeleteIcon={members.length > numberOfSignatures}
                  onChangeMember={changeMember}
                  onDeleteMember={deleteMember}
                />
              ))}
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default Form;
