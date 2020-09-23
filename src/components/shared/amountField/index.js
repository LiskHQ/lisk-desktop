import React from 'react';
import { Input } from '../../toolbox/inputs';
import { TertiaryButton } from '../../toolbox/buttons';
import {
  formatAmountBasedOnLocale,
} from '../../../utils/formattedNumber';
import { fromRawLsk } from '../../../utils/lsk';
import Converter from '../converter';
import styles from './amountField.css';

const AmountField = ({
  amount, maxAmount, setAmountField,
  title, maxAmountTitle, inputPlaceHolder, name,
}) => {
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
        <span className={`${styles.fieldLabel}`}>{title}</span>
        {
          maxAmount && (
            <TertiaryButton
              onClick={setEntireBalance}
              className="send-entire-balance-button"
              size="xs"
            >
              {maxAmountTitle}
            </TertiaryButton>
          )
        }
      </div>
      <span className={`${styles.amountField} amount`}>
        <Input
          autoComplete="off"
          onChange={handleAmountChange}
          name={name}
          value={amount.value}
          placeholder={inputPlaceHolder}
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
