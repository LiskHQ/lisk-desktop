import React from 'react';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import { parseSearchParams } from '../../../../../utils/searchParams';
import AmountField from './amountField';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import BoxFooter from '../../../../toolbox/box/footer';
import BoxHeader from '../../../../toolbox/box/header';
import Piwik from '../../../../../utils/piwik';
import styles from './form.css';
import useAmountField from './useAmountField';
import useRecipientField from './useRecipientField';

const FormBase = ({
  t, token, children, extraFields, fee, networkConfig, getMaxAmount,
  bookmarks, history, nextStep, prevState, onInputChange,
}) => {
  const {
    recipient: initialRecipient = '',
    amount: initialAmount,
  } = parseSearchParams(history.location.search);

  const [amount, setAmountField] = useAmountField(
    prevState && prevState.fields ? prevState.fields.amount.value : initialAmount,
    getMaxAmount,
  );
  const [recipient, setRecipientField] = useRecipientField(
    prevState && prevState.fields ? prevState.fields.recipient.value : initialRecipient,
  );

  const handleRecipientChange = (name, value) => {
    onInputChange({ target: { name, value: value.value } }, value);
    setRecipientField({
      ...recipient,
      ...value,
    });
  };

  const allFields = { ...extraFields, amount, recipient };

  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields: allFields });
  };

  const handleAmountChange = ({ target }) => {
    const value = { value: target.value };
    onInputChange({ target }, value);
    setAmountField(value);
  };

  const isSubmitButtonDisabled = !!(amount.isLoading
      || Object.values({ amount, recipient }).find(({ value }) => value === '')
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
            recipient={recipient}
            t={t}
            token={token}
            updateField={handleRecipientChange}
          />
        </span>
        <AmountField
          t={t}
          amount={amount}
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
  onInputChange: () => {},
};

export default FormBase;
