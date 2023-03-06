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

// eslint-disable-next-line max-statements
export const ChangeCommissionForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const {
    currentCommission,
    isLoading,
    isSuccess: isCommissionSuccess,
  } = useCurrentCommissionPercentage();
  const [newCommission, setNewCommission] = useState(currentCommission);

  useEffect(() => {
    if (currentCommission && currentCommission !== newCommission) {
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

  const newCommissionParam = convertCommissionToNumber(newCommission);
  const newCommissionValid = checkCommissionValidity(newCommission, currentCommission);
  const isFormValid =
    newCommission !== currentCommission &&
    newCommissionParam &&
    newCommissionParam >= 0 &&
    newCommissionParam <= 10000 &&
    newCommissionValid;
  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
    params: { newCommission: newCommissionParam },
    fields: { newCommission },
    isFormValid,
  };
  const commandParams = {
    newCommission: newCommissionParam,
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
                onChange={({ target: { value } }) => setNewCommission(value)}
                name="newCommission"
                value={newCommission}
                isLoading={isLoading}
                placeholder="*.**"
                className={`${styles.input} select-name-input`}
                feedback={isFormValid ? undefined : t('Commission range is invalid')}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};
