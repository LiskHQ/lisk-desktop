import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { Input } from 'src/theme';
import TxComposer from '@transaction/components/TxComposer';
import { convertCommissionToNumber } from '@pos/validator/utils';
import { useCurrentCommissionPercentage } from '@pos/validator/hooks/useCurrentCommissionPercentage';
import InputLabel from './InputLabel';
import styles from './ChangeCommissionForm.css';

export const ChangeCommissionForm = ({ nextStep }) => {
  const { t } = useTranslation();
  const { currentCommission, isLoading, isSuccess: isCommissionSuccess } = useCurrentCommissionPercentage();
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

  const formProps = {
    isValid: true,
    moduleCommand: MODULE_COMMANDS_NAME_MAP.changeCommission,
    params: { newCommission: convertCommissionToNumber(newCommission) },
    fields: { newCommission },
  };
  const commandParams = {
    newCommission: convertCommissionToNumber(newCommission),
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
            <InputLabel title={t('Commission (%)')} />
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
                // feedback={newCommission.message}
              />
            </div>
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};
