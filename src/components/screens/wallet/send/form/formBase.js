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
  t, token, children, extraFields, fee, networkConfig, getMaxAmount,
  bookmarks, nextStep, fieldUpdateFunctions,
}) => {
  const { setAmountField, setRecipientField } = fieldUpdateFunctions;
  const fields = { amount: extraFields.amount, recipient: extraFields.recipient };

  const handleRecipientChange = (name, value) => {
    setRecipientField({
      ...fields.recipient,
      ...value,
    });
  };

  const allFields = { ...extraFields, ...fields };

  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields: allFields });
  };

  const handleAmountChange = ({ target }) => {
    setAmountField(target);
  };

  const isSubmitButtonDisabled = !!(fields.amount.isLoading
      || Object.values(fields).find(({ value }) => value === '')
      || Object.values(allFields).find(({ error }) => error)
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
          t={t}
          amount={fields.amount}
          extraFields={extraFields}
          fee={fee}
          getMaxAmount={getMaxAmount}
          onAmountChange={handleAmountChange}
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

FormBase.defaultProps = {
  extraFields: {},
  prevState: {},
};

export default FormBase;
