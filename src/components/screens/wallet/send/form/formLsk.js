import React from 'react';
import { AutoresizeTextarea } from '../../../../toolbox/inputs';
import { fromRawLsk } from '../../../../../utils/lsk';
import { messageMaxLength } from '../../../../../constants/transactions';
import { parseSearchParams } from '../../../../../utils/searchParams';
import CircularProgress from '../../../../toolbox/circularProgress/circularProgress';
import Fees from '../../../../../constants/fees';
import FormBase from './formBase';
import Icon from '../../../../toolbox/icon';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useCommonFields from './useCommonFields';
import useMessageField from './useMessageField';

const FormLsk = (props) => {
  const {
    account, prevState, t, history,
  } = props;

  const { reference: referenceFromUrl } = parseSearchParams(history.location.search);

  const [reference, onReferenceChange] = useMessageField(
    prevState && prevState.fields ? prevState.fields.reference.value : referenceFromUrl || '',
  );
  const getMaxAmount = () => fromRawLsk(Math.max(0, account.balance - Fees.send));

  const {
    fields: { amount, recipient },
    fieldUpdateFunctions,
  } = useCommonFields(prevState, history, getMaxAmount);

  const fields = {
    amount,
    recipient,
    reference,
    fee: { value: Fees.send },
  };

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
          <AutoresizeTextarea
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
            className="showOnTop"
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
    </FormBase>
  );
};

FormLsk.defaultProps = {
  prevState: {},
};

export default FormLsk;
