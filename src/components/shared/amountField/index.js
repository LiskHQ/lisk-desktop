import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { fromRawLsk } from '@utils/lsk';
import { Input } from '@toolbox/inputs';
import { TertiaryButton } from '@toolbox/buttons';
import Icon from '@toolbox/icon';
import Tooltip from '@toolbox/tooltip/tooltip';
import Converter from '../converter';
import styles from './amountField.css';

export const MaxAmountWarning = ({ resetInput, message, ignoreClicks }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.entireBalanceWarning} entire-balance-warning`} onClick={ignoreClicks}>
      <Icon name="warningYellow" />
      <span>{message || t('You are about to send your entire balance')}</span>
      <div
        className={`${styles.closeBtn} close-entire-balance-warning`}
        onClick={resetInput}
      />
    </div>
  );
};

// eslint-disable-next-line complexity
const AmountField = ({
  amount, maxAmount, onChange, className,
  label, labelClassname, useMaxLabel, placeholder, name,
  displayConverter, useMaxWarning,
}) => {
  const { t } = useTranslation();
  const [showEntireBalanceWarning, setShowEntireBalanceWarning] = useState(false);
  const [isMaximum, setIsMaximum] = useState(false);

  const setEntireBalance = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMaximum(true);
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
  };

  const handleAmountChange = ({ target }) => {
    onChange(target, maxAmount);
    setIsMaximum(false);
    if (showEntireBalanceWarning && target.value < maxAmount.value) {
      setShowEntireBalanceWarning(false);
    }
  };

  const ignoreClicks = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (isMaximum && maxAmount) {
      const value = formatAmountBasedOnLocale({
        value: fromRawLsk(maxAmount.value),
        format: '0.[00000000]',
      });
      onChange({ value }, maxAmount);
    }
  }, [isMaximum, maxAmount?.value]);

  return (
    <span className={`${styles.fieldGroup} ${amount.error ? styles.error : ''} ${className}`}>
      <div className={labelClassname ? `${styles.customAmountFieldHeader} ${styles.amountFieldHeader}` : `${styles.amountFieldHeader}`} onClick={ignoreClicks}>
        { label && <span className={labelClassname ? `${styles.customFieldLabel} ${styles.fieldLabel} label` : `${styles.fieldLabel}`}>{label}</span> }
        {
          useMaxLabel && (
            <TertiaryButton
              onClick={setEntireBalance}
              className="use-entire-balance-button"
              size="xs"
            >
              {useMaxLabel}
              <Tooltip
                position="bottom"
                tooltipClassName={`${styles.tooltipContainer}`}
              >
                <span>{t('Based on your available balance and rounded down to a multiple of 10 LSK, your total remaining balance is {{maxAmount}} LSK', { maxAmount: fromRawLsk(maxAmount.value) })}</span>
              </Tooltip>
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
          ignoreClicks={ignoreClicks}
        />
      )}
    </span>
  );
};

export default AmountField;
