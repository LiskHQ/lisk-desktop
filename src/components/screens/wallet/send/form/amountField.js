import React from 'react';
import { Input } from '../../../../toolbox/inputs';
import { TertiaryButton } from '../../../../toolbox/buttons/button';
import {
  formatAmountBasedOnLocale,
} from '../../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../../utils/lsk';
import Converter from '../../../../shared/converter';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './form.css';

const AmountField = ({
  t, amount, setEntireBalance, fee, onAmountChange,
}) => (
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
        onChange={onAmountChange}
        name="amount"
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
    { fee ? (
      <span className={styles.amountHint}>
        {t('+ Transaction fee {{fee}} LSK', {
          fee: formatAmountBasedOnLocale({ value: fromRawLsk(fee) }),
        })}
        <Tooltip
          className="showOnTop"
          title={t('Transaction fee')}
        >
          <p className={styles.tooltipText}>
            {
                    t(`Every transaction needs to be confirmed and forged into Lisk blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`)
                  }
          </p>
        </Tooltip>
      </span>
    ) : null }
  </label>
);

export default AmountField;
