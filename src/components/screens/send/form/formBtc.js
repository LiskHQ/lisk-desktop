import React from 'react';
import {
  formatAmountBasedOnLocale,
} from '../../../../utils/formattedNumber';
import { fromRawLsk, toRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import DynamicFee from '../../../shared/dynamicFee';
import Spinner from '../../../toolbox/spinner';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';
import useRecipientField from './useRecipientField';

const FormBtc = (props) => {
  const {
    t, token, getInitialValue, account,
  } = props;
  const txType = 'transfer';

  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed(token);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), token);

  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const [fee, maxAmount] = useDynamicFeeCalculation(processingSpeed, {
    amount: toRawLsk(amount.value), txType, recipient: recipient.value,
  }, token, account);

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
        <DynamicFee
          priorities={feeOptions}
          selectedPriority={processingSpeed.selectedIndex}
          setSelectedPriority={selectProcessingSpeed}
          token={token}
          fee={feeOptions[0].value === 0 ? 0 : getProcessingSpeedStatus()}
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
