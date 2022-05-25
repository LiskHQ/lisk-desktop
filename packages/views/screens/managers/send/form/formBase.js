import React from 'react';
import Piwik from 'src/utils/piwik';
import { PrimaryButton } from 'src/theme/buttons';
import AmountField from 'src/modules/common/components/amountField';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import BoxFooter from 'src/theme/box/footer';
import BoxHeader from 'src/theme/box/header';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import styles from './form.css';

const FormBase = ({
  t,
  token,
  children,
  fields,
  network,
  maxAmount,
  bookmarks,
  nextStep,
  fieldUpdateFunctions,
}) => {
  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields });
  };

  const isSubmitButtonDisabled = Object.values(fields).some(
    ({
      error, required, value, isLoading,
    }) =>
      error || (required && value === '') || isLoading,
  );

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{t('Send {{token}}', { token })}</h1>
      </BoxHeader>
      <BoxContent className={styles.formSection}>
        <span className={`${styles.fieldGroup} recipient`}>
          <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
          <BookmarkAutoSuggest
            bookmarks={bookmarks[token].filter((item) => !item.disabled)}
            network={network}
            recipient={fields.recipient}
            t={t}
            token={token}
            updateField={fieldUpdateFunctions.setRecipientField}
          />
        </span>
        <AmountField
          amount={fields.amount}
          onChange={fieldUpdateFunctions.setAmountField}
          maxAmount={maxAmount}
          displayConverter
          label={t('Amount')}
          placeHolder={t('Insert transaction amount')}
          useMaxLabel={t('Send maximum amount')}
          name="amount"
        />
        {children}
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
