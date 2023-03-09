import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import { convertCommissionToNumber, checkCommissionValidity } from '@pos/validator/utils';
import { useCurrentCommissionPercentage } from '@pos/validator/hooks/useCurrentCommissionPercentage';
import styles from './ChangeCommissionForm.css';

export const ChangeCommissionForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const {
    currentCommission,
    isLoading,
    isSuccess: isCommissionSuccess,
  } = useCurrentCommissionPercentage();
  const [newCommission, setNewCommission] = useState({
    value: currentCommission,
    feedback: '',
    numericValue: convertCommissionToNumber(currentCommission),
  });

  useEffect(() => {
    if (currentCommission && currentCommission !== newCommission.value) {
      setNewCommission(currentCommission);
    }
  }, [isCommissionSuccess]);

  const onConfirm = (formProps, transactionJSON, selectedPriority, fees) => {
    nextStep({
      selectedPriority,
      formProps,
      transactionJSON,
      fees,
    });
  };

  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
    params: { newCommission: newCommission.numericValue },
    fields: { newCommission: newCommission.value },
    isFormValid: newCommission.value !== currentCommission && !newCommission.feedback,
  };
  const commandParams = {
    newCommission: newCommission.numericValue,
  };

  const checkCommissionFeedback = (value) => {
    let inputFeedback;
    const newCommissionParam = convertCommissionToNumber(value);
    const newCommissionValid = checkCommissionValidity(value, currentCommission);
    const isFormValid =
      value !== currentCommission &&
      newCommissionParam &&
      newCommissionParam >= 0 &&
      newCommissionParam <= 10000 &&
      newCommissionValid;
    if (checkCommissionValidity(value, currentCommission)) {
      if (isFormValid) {
        inputFeedback = undefined;
      }
    } else if (newCommissionParam >= 0 && newCommissionParam <= 10000) {
      inputFeedback = t('You cannot increase commission more than 5%');
    } else {
      inputFeedback = t('Commission range is invalid');
    }
    return { feedback: inputFeedback, numericValue: newCommissionParam };
  };

  const onCommissionChange = ({ target: { value } }) => {
    const { feedback, numericValue } = checkCommissionFeedback(value);
    setNewCommission({
      value,
      feedback,
      numericValue,
    });
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onConfirm={onConfirm}
        formProps={formProps}
        commandParams={commandParams}
        buttonTitle="Confirm"
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Edit commission')}</h2>
            <p>
              {t(
                'The commission set will be your reward while the rest will be shared with the stakers.'
              )}
            </p>
          </BoxHeader>
          <BoxContent className={`${styles.container} select-name-container`}>
            <label className={styles.label}>{t('Commission (%)')}</label>
            <div className={styles.inputContainer}>
              <Input
                data-name="change-commission"
                autoComplete="off"
                onChange={onCommissionChange}
                name="newCommission"
                value={newCommission.value}
                isLoading={isLoading}
                placeholder="*.**"
                className={`${styles.input} select-name-input`}
                status={newCommission.feedback ? 'error' : ''}
                feedback={newCommission.feedback}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};
