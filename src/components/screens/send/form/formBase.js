import React from 'react';
import Piwik from '@utils/piwik';
import { PrimaryButton } from '@toolbox/buttons';
import { tokenMap } from '@constants';
import AmountField from '@shared/amountField';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import BoxHeader from '@toolbox/box/header';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import styles from './form.css';

const FormBase = ({
  t, token, children, fields, network, maxAmount,
  bookmarks, nextStep, fieldUpdateFunctions,
}) => {
  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields });
  };

  const isSubmitButtonDisabled = Object.values(fields).some(({
    error, required, value, isLoading,
  }) => error || (required && value === '') || isLoading);

  return (
    <Box className={styles.wrapper}>
      <BoxHeader>
        <h1>{ t('Send {{token}}', { token }) }</h1>
      </BoxHeader>
      <BoxContent className={styles.formSection}>
        <span className={`${styles.fieldGroup} recipient`}>
          <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
          <BookmarkAutoSuggest
            bookmarks={token === tokenMap.LSK.key
              ? bookmarks[token].filter(item => !item.disabled) : bookmarks[token]}
            network={network}
            recipient={fields.recipient}
            t={t}
            token={token}
            updateField={fieldUpdateFunctions.setRecipientField}
          />
        </span>
        <AmountField
          amount={fields.amount}
          maxAmount={maxAmount}
          setAmountField={fieldUpdateFunctions.setAmountField}
          title={t('Amount')}
          maxAmountTitle={t('Send maximum amount')}
          inputPlaceHolder={t('Insert transaction amount')}
          name="amount"
          t={t}
          displayConverter
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
