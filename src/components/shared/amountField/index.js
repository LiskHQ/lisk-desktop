import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';
import { Input } from '@toolbox/inputs';
import { TertiaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import Converter from '../converter';
import styles from './amountField.css';

const MaxAmountWarning = ({ resetInput, message }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.entireBalanceWarning} entire-balance-warning`}>
      <Icon name="warningYellow" />
      <span>{message || t('You are about to send your entire balance')}</span>
      <div
        className={`${styles.closeBtn} close-entire-balance-warning`}
        onClick={resetInput}
      />
    </div>
  );
};

const AmountField = ({
  amount, maxAmount, onChange, className,
  label, useMaxLabel, placeholder, name,
  displayConverter, useMaxWarning,
}) => {
  const [showEntireBalanceWarning, setShowEntireBalanceWarning] = useState(false);
  const setEntireBalance = (e) => {
    e.preventDefault();
    const value = formatAmountBasedOnLocale({
      value: fromRawLsk(maxAmount.value),
      format: '0.[00000000]',
    });
    onChange({ value }, maxAmount);
    setShowEntireBalanceWarning(true);
  };

  const resetInput = (e) => {
    e.preventDefault();
    setShowEntireBalanceWarning(false);
    onChange({ value: '' }, maxAmount);
  };

  const handleAmountChange = ({ target }) => {
    onChange(target, maxAmount);
    if (showEntireBalanceWarning && target.value < maxAmount.value) {
      setShowEntireBalanceWarning(false);
    }
  };

  const ignoreClicks = (e) => {
    e.preventDefault();
  };

  return (
    <label className={`${styles.fieldGroup} ${amount.error ? styles.error : ''} ${className}`}>
      <div className={`${styles.amountFieldHeader}`} onClick={ignoreClicks}>
        { label && <span className={`${styles.fieldLabel}`}>{label}</span> }
        {
          useMaxLabel && (
            <TertiaryButton
              onClick={setEntireBalance}
              className="use-entire-balance-button"
              size="xs"
            >
              {useMaxLabel}
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
          placeholder={placeholder}
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
      {(showEntireBalanceWarning && useMaxWarning !== false) && (
        <MaxAmountWarning
          message={useMaxWarning}
          resetInput={resetInput}
        />
      )}
    </label>
  );
};

export default AmountField;
