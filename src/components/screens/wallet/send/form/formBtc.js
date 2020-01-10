import React from 'react';
import {
  formatAmountBasedOnLocale,
} from '../../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../../utils/lsk';
import FormBase from './formBase';
import Selector from '../../../../toolbox/selector/selector';
import Spinner from '../../../../toolbox/spinner';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';
import useRecipientField from './useRecipientField';

const FormBtc = (props) => {
  const {
    t, account, token, getInitialValue,
  } = props;


  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed();
  const [getDynamicFee, getMaxAmount] = useDynamicFeeCalculation(account, processingSpeed.value);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), getMaxAmount);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    processingSpeed,
    fee: getDynamicFee(amount.value),
  };

  const getProcessingSpeedStatus = () => (!fields.fee.error
    ? `${formatAmountBasedOnLocale({ value: fromRawLsk(fields.fee.value) })} ${token}`
    : fields.fee.feedback);

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      getMaxAmount={getMaxAmount}
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
            { processingSpeed.isLoading
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
