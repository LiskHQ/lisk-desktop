import React from 'react';
import { AutoResizeTextarea } from '../../../toolbox/inputs';
import { fromRawLsk } from '../../../../utils/lsk';
import { messageMaxLength } from '../../../../constants/transactions';
import CircularProgress from '../../../toolbox/circularProgress/circularProgress';
import Fees from '../../../../constants/fees';
import FormBase from './formBase';
import Icon from '../../../toolbox/icon';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';
import DynamicFee from './dynamicFee';

const FormLsk = (props) => {
  const { account, t, getInitialValue } = props;

  const getMaxAmount = () => fromRawLsk(Math.max(0, account.balance - Fees.send));

  const [reference, onReferenceChange] = useMessageField(getInitialValue('reference'));
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), getMaxAmount);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    reference,
    fee: { value: Fees.send }, // @todo implement dynamic fee calculation
  };

  // @todo define getProcessingSpeedStatus. Because the Lisk Service
  // API is not ready, mock the low/medium/high processing speeds
  // With constants. Make the custom fee input the default view.

  return (
    <FormBase
      {...props}
      fields={fields}
      showFee
      fieldUpdateFunctions={fieldUpdateFunctions}
      getMaxAmount={getMaxAmount}
    >
      <label className={`${styles.fieldGroup} reference`}>
        <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
        <span className={styles.referenceField}>
          <AutoResizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onReferenceChange}
            name="reference"
            value={reference.value}
            placeholder={t('Write message')}
            className={`${styles.textarea} ${reference.error ? 'error' : ''} message`}
          />
          <CircularProgress
            max={messageMaxLength}
            value={reference.byteCount}
            className={`${styles.byteCounter} ${reference.error ? styles.hide : ''}`}
          />
          <Icon
            className={`${styles.status} ${styles.referenceStatus} ${!reference.value ? styles.hide : styles.show}`}
            name={reference.error ? 'alertIcon' : 'okIcon'}
          />
        </span>
        <span className={`${styles.feedback} ${reference.error || messageMaxLength - reference.byteCount < 10 ? 'error' : ''} ${styles.show}`}>
          {reference.feedback}
          <Tooltip
            position="top left"
            title={t('Bytes counter')}
          >
            <p className={styles.tooltipText}>
              {
                    t(`Lisk counts your message by bytes so keep in mind 
                    that the length on your message may vary in different languages. 
                    Different characters may consume different amount of bytes space.`)
                  }
            </p>
          </Tooltip>
        </span>
      </label>
      <DynamicFee
        priorities={[
          { label: 'Low', fee: 0.1 },
          { label: 'Medium', fee: 0.3 },
          { label: 'High', fee: 1 },
          { label: 'Custom', fee: undefined },
        ]}
      />
    </FormBase>
  );
};

export default FormLsk;
