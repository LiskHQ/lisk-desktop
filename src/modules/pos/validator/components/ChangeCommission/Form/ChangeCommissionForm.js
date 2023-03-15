import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import { convertCommissionToNumber, checkCommissionValidity } from '@pos/validator/utils';
import { useCurrentCommissionPercentage } from '@pos/validator/hooks/useCurrentCommissionPercentage';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { usePosConstants } from '../../../hooks/queries';
import styles from './ChangeCommissionForm.css';

// eslint-disable-next-line max-statements
export const ChangeCommissionForm = ({ prevState, nextStep }) => {
  const { t } = useTranslation();
  const getInitialCommission = (formProps, initialValue) =>
    formProps?.fields.newCommission || initialValue || '';
  const {
    currentCommission,
    isLoading,
    isSuccess: isCommissionSuccess,
  } = useCurrentCommissionPercentage();
  const defaultCommission = getInitialCommission(prevState.formProps, currentCommission);
  const defaultNumericValue = convertCommissionToNumber(defaultCommission);
  const [newCommission, setNewCommission] = useState({
    value: defaultCommission,
    feedback: '',
    numericValue: defaultNumericValue,
  });
  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens } = useTokensBalance({
    config: { params: { tokenID: posConstants?.posTokenID } },
    options: { enabled: !isGettingPosConstants },
  });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  useEffect(() => {
    if (currentCommission && currentCommission !== newCommission.value) {
      setNewCommission({
        value: defaultCommission,
        feedback: '',
        numericValue: defaultNumericValue,
      });
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
    fields: { newCommission: newCommission.value, token },
    isFormValid: newCommission.value !== currentCommission && !newCommission.feedback,
  };
  const commandParams = {
    newCommission: newCommission.numericValue,
  };

  const checkCommissionFeedback = (value) => {
    let inputFeedback;
    const newCommissionParam = convertCommissionToNumber(value);
    const isNewCommissionValid = checkCommissionValidity(value, currentCommission);

    if (value.split('.')[1].length > 2) {
      inputFeedback = t('Input decimal places limited to 2');
    } else if (!(newCommissionParam >= 0 && newCommissionParam <= 10000)) {
      inputFeedback = t('Commission range is invalid');
    } else if (!isNewCommissionValid) {
      inputFeedback = t('You cannot increase commission more than 5%');
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
                status={newCommission.feedback ? 'error' : 'ok'}
                feedback={newCommission.feedback}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};
