import React from 'react';
import { AutoResizeTextarea } from '../../../toolbox/inputs';
import { messageMaxLength } from '../../../../constants/transactions';
import CircularProgress from '../../../toolbox/circularProgress/circularProgress';
import FormBase from './formBase';
import Icon from '../../../toolbox/icon';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useMessageField from './useMessageField';
import useRecipientField from './useRecipientField';
import { toRawLsk, fromRawLsk } from '../../../../utils/lsk';
import Selector from '../../../toolbox/selector/selector';
import Spinner from '../../../toolbox/spinner';

import {
  formatAmountBasedOnLocale,
} from '../../../../utils/formattedNumber';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';

// eslint-disable-next-line max-statements
const FormLsk = (props) => {
  const {
    t, token, getInitialValue, account,
  } = props;

  const txType = 'transfer';

  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed();


  const [reference, onReferenceChange] = useMessageField(getInitialValue('reference'));
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'));

  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));

  const [fee, maxAmount] = useDynamicFeeCalculation(processingSpeed, {
    amount: toRawLsk(amount.value),
    txType,
    recipient: recipient.value,
    nonce: account.nonce,
    senderPublicKey: account.publicKey,
  });


  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    reference,
    fee,
    processingSpeed,
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

export default FormLsk;
