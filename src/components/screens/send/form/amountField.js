import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../toolbox/inputs';
import { TertiaryButton } from '../../../toolbox/buttons';
import {
  formatAmountBasedOnLocale,
} from '../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../utils/lsk';
import Converter from '../../../shared/converter';
import styles from './form.css';

const AmountField = ({
  amount, maxAmount, setAmountField,
}) => {
  const { t } = useTranslation();
  const name = 'amount';
  const setEntireBalance = () => {
    const value = formatAmountBasedOnLocale({
      value: fromRawLsk(maxAmount.value),
      format: '0.[00000000]',
    });
    setAmountField({ value }, maxAmount);
  };

  const handleAmountChange = ({ target }) => {
    setAmountField(target, maxAmount);
  };

  return (
    <label className={[
      styles.fieldGroup, amount.error && styles.error,
    ].filter(Boolean).join(' ')}
    >
      <div className={`${styles.amountFieldHeader}`}>
        <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
        <TertiaryButton
          onClick={setEntireBalance}
          className="send-entire-balance-button"
          size="xs"
        >
          {t('Send entire balance')}
        </TertiaryButton>
      </div>
      <span className={`${styles.amountField} amount`}>
        <Input
          autoComplete="off"
          onChange={handleAmountChange}
          name={name}
          value={amount.value}
          placeholder={t('Insert the amount of transaction')}
          className={`${styles.input} ${amount.error ? 'error' : ''}`}
          isLoading={amount.isLoading}
          status={amount.error ? 'error' : 'ok'}
          feedback={amount.feedback}
        />
        <Converter
          className={styles.converter}
          value={amount.value}
          error={amount.error}
        />
      </span>
    </label>
  );
};

export default AmountField;
