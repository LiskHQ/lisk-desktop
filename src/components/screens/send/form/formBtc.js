import React from 'react';
import {
  formatAmountBasedOnLocale,
} from '../../../../utils/formattedNumber';
import { fromRawLsk, toRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import Selector from '../../../toolbox/selector/selector';
import Spinner from '../../../toolbox/spinner';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';
import useRecipientField from './useRecipientField';

// eslint-disable-next-line max-statements
const FormBtc = (props) => {
  const {
    t, token, getInitialValue,
  } = props;
  const txType = 'transfer';

  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed();
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'));

  // @todo use real transaction object
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const [fee, maxAmount] = useDynamicFeeCalculation(processingSpeed, {
    amount: toRawLsk(amount.value), txType, recipient: recipient.value,
  });

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    processingSpeed,
    fee,
  };

  const getProcessingSpeedStatus = () => (!fields.fee.error
    ? `${formatAmountBasedOnLocale({ value: fromRawLsk(fields.fee.value) })} ${token}`
    : fields.fee.feedback);

  // @todo Move the processing speed to FormBase because it is used
  // on both LSK and BTC platforms.

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <div className={`${styles.fieldGroup} processing-speed`}>
        <span className={`${styles.fieldLabel}`}>
          {t('Processing Speed')}
          <Tooltip>
            <p className={styles.tooltipText}>
              {
                t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.')
              }
            </p>
          </Tooltip>
        </span>
        <Selector
          className={styles.selector}
          onSelectorChange={selectProcessingSpeed}
          name="speedSelector"
          selectedIndex={fields.processingSpeed.selectedIndex}
          options={feeOptions}
        />
        <span className={styles.processingInfo}>
          {`${t('Transaction fee')}: `}
          <span>
            { feeOptions[0].value === 0
              ? (
                <React.Fragment>
                  {t('Loading')}
                  {' '}
                  <Spinner className={styles.loading} />
                </React.Fragment>
              )
              : getProcessingSpeedStatus()
            }
          </span>
        </span>
      </div>
    </FormBase>
  );
};

export default FormBtc;
