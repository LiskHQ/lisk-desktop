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
import useProcessingSpeed from './useProcessingSpeed';

const FormBtc = (props) => {
  const {
    t, account, token,
  } = props;

  // TODO change something so that amount state is not needed here
  const [amount, setAmount] = React.useState({ value: '' });

  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed(account, amount);

  const onInputChange = ({ target }, newAmountState) => {
    /* istanbul ignore else */
    if (target.name === 'amount') {
      setAmount(newAmountState);
    }
  };

  const fields = {
    amount,
    processingSpeed,
    fee: {
      value: 0,
    },
  };

  /**
   * Get status of processing speed fetch based on state of component
   * @returns {Node} - Text to display to the user or loader
   */
  const getProcessingSpeedStatus = () => {
    if (amount.value === '') return '-';
    if (processingSpeed.isLoading) {
      return (
        <React.Fragment>
          {t('Loading')}
          {' '}
          <Spinner className={styles.loading} />
        </React.Fragment>
      );
    }
    const fee = formatAmountBasedOnLocale({ value: fromRawLsk(processingSpeed.txFee) });

    return !amount.error
      ? `${fee} ${token}`
      : t('Invalid amount');
  };

  return (
    <FormBase
      {...props}
      extraFields={fields}
      onInputChange={onInputChange}
      fee={fields.processingSpeed.value}
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
          <span>{getProcessingSpeedStatus()}</span>
        </span>
      </div>
    </FormBase>
  );
};

export default FormBtc;
