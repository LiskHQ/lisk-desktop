import React from 'react';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import AmountField from './amountField';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import BoxFooter from '../../../../toolbox/box/footer';
import BoxHeader from '../../../../toolbox/box/header';
import Piwik from '../../../../../utils/piwik';
import styles from './form.css';

const FormBase = ({
  t, token, children, fields, showFee, networkConfig, getMaxAmount,
  bookmarks, nextStep, fieldUpdateFunctions,
}) => {
  const { setAmountField, setRecipientField } = fieldUpdateFunctions;

  const handleRecipientChange = (name, value) => {
    setRecipientField({
      ...fields.recipient,
      ...value,
    });
  };

  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields });
  };

  const isSubmitButtonDisabled = !!(fields.amount.isLoading
      || [fields.amount, fields.recipient].find(({ value }) => value === '')
      || Object.values(fields).find(({ error }) => error)
  );
  return (
    <Box className={styles.wrapper} width="medium">
      <BoxHeader>
        <h1>{ t('Send {{token}}', { token }) }</h1>
      </BoxHeader>
      <BoxContent className={styles.formSection}>
        <span className={`${styles.fieldGroup} recipient`}>
          <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
          <BookmarkAutoSuggest
            bookmarks={bookmarks[token]}
            networkConfig={networkConfig}
            recipient={fields.recipient}
            t={t}
            token={token}
            updateField={handleRecipientChange}
          />
        </span>
        <AmountField
          amount={fields.amount}
          fee={showFee ? fields.fee.value : null}
          getMaxAmount={getMaxAmount}
          setAmountField={setAmountField}
        />
        { children }
      </BoxContent>
      <BoxFooter>
        <PrimaryButton
          className={`${styles.confirmButton} btn-submit send-next-button`}
          disabled={isSubmitButtonDisabled}
          onClick={onGoNext}
        >
          {t('Go to confirmation')}
        </PrimaryButton>
      </BoxFooter>
    </Box>
  );
};

export default FormBase;
