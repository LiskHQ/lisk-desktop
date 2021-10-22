import React, { useState } from 'react';
import {
  formatAmountBasedOnLocale,
} from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';
import { Input } from '@toolbox/inputs';
import { TertiaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import Converter from '../converter';
import styles from './amountField.css';

const AmountField = ({
  amount, maxAmount, setAmountField, className,
  title, maxAmountTitle, inputPlaceHolder, name,
  displayConverter, t,
}) => {
  const [showEntireBalanceWarning, setShowEntireBalanceWarning] = useState(false);
  const setEntireBalance = (e) => {
    e.preventDefault();
    const value = formatAmountBasedOnLocale({
      value: fromRawLsk(maxAmount.value),
      format: '0.[00000000]',
    });
    setAmountField({ value }, maxAmount);
    setShowEntireBalanceWarning(true);
  };

  const resetInput = (e) => {
    e.preventDefault();
    setShowEntireBalanceWarning(false);
    setAmountField({ value: '' }, maxAmount);
  };

  const handleAmountChange = ({ target }) => {
    setAmountField(target, maxAmount);
    if (showEntireBalanceWarning && target.value < maxAmount.value) {
      setShowEntireBalanceWarning(false);
    }
  };

  const ignoreClicks = (e) => {
    e.preventDefault();
  };

  return (
    <label className={[
      styles.fieldGroup, amount.error && styles.error, className,
    ].filter(Boolean).join(' ')}
    >
      <div className={`${styles.amountFieldHeader}`} onClick={ignoreClicks}>
        { title && <span className={`${styles.fieldLabel}`}>{title}</span> }
        {
          maxAmount && (
            <TertiaryButton
              onClick={setEntireBalance}
              className="use-entire-balance-button"
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
        {displayConverter && (
          <Converter
            className={styles.converter}
            value={amount.value}
            error={amount.error}
            isLoading={amount.isLoading}
          />
        )}
      </span>
      {showEntireBalanceWarning && (
        <div className={`${styles.entireBalanceWarning} entire-balance-warning`}>
          <Icon name="warningYellow" />
          <span>{t('You are about to send your entire balance')}</span>
          <div
            className={`${styles.closeBtn} close-entire-balance-warning`}
            onClick={resetInput}
          />
        </div>
      )}
    </label>
  );
};

export default AmountField;
