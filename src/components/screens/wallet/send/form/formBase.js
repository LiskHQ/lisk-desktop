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
  t, token, children, extraFields, fee, networkConfig,
  bookmarks, history, nextStep, prevState, onInputChange, account,
}) => {
  const {
    recipient: initialRecipient = '',
    amount: initialAmount,
  } = parseSearchParams(history.location.search);
  const [amount, _onAmountChange, _setEntireBalance] = useAmountField(
    prevState && prevState.fields ? prevState.fields.amount.value : initialAmount,
    fee,
    account,
  );
  const [recipient, onRecipientChange] = useRecipientField(
    prevState && prevState.fields ? prevState.fields.recipient.value : initialRecipient,
  );

  const updateField = (name, value) => {
    // TODO change this function to accept the params in same format as onAmountChange function
    onInputChange({ target: { name, value: value.value } }, value);
    onRecipientChange({
      ...recipient,
      ...value,
    });
  };

  const allFields = { ...extraFields, amount, recipient };

  const onGoNext = () => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({ fields: allFields });
  };

  const setEntireBalance = () => {
    _setEntireBalance(fee);
  };

  const onAmountChange = ({ target }) => {
    onInputChange({ target }, target.value);
    _onAmountChange({ target });
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
            updateField={updateField}
          />
        </span>
        <AmountField
          t={t}
          amount={amount}
          extraFields={extraFields}
          fee={extraFields.processingSpeed ? null : fee}
          setEntireBalance={setEntireBalance}
          onAmountChange={onAmountChange}
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
