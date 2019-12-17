import React from 'react';
import { AutoresizeTextarea } from '../../../../toolbox/inputs';
import { parseSearchParams } from '../../../../../utils/searchParams';
import CircularProgress from '../../../../toolbox/circularProgress/circularProgress';
import Fees from '../../../../../constants/fees';
import FormBase from './formBase';
import Icon from '../../../../toolbox/icon';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useMessage from './useMessage';

const FormLsk = (props) => {
  const { prevState, t } = props;

  const { reference: referenceFromUrl } = parseSearchParams(props.history.location.search);

  const messageMaxLength = 64;

  const [reference, onReferenceChange] = useMessage(
    prevState && prevState.fields ? prevState.fields.reference.value : referenceFromUrl || '',
    messageMaxLength,
  );

  const fields = { reference };
  return (
    <FormBase
      {...props}
      extraFields={fields}
      fee={Fees.send}
    >
      <label className={`${styles.fieldGroup} reference`}>
        <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
        <span className={styles.referenceField}>
          <AutoresizeTextarea
            maxLength={100}
            spellCheck={false}
            onChange={onReferenceChange}
            name="reference"
            value={fields.reference.value}
            placeholder={t('Write message')}
            className={`${styles.textarea} ${fields.reference.error ? 'error' : ''} message`}
          />
          <CircularProgress
            max={messageMaxLength}
            value={reference.byteCount}
            className={`${styles.byteCounter} ${fields.reference.error ? styles.hide : ''}`}
          />
          <Icon
            className={`${styles.status} ${styles.referenceStatus} ${!fields.reference.value ? styles.hide : styles.show}`}
            name={fields.reference.error ? 'alertIcon' : 'okIcon'}
          />
        </span>
        <span className={`${styles.feedback} ${fields.reference.error || messageMaxLength - reference.byteCount < 10 ? 'error' : ''} ${styles.show}`}>
          {fields.reference.feedback}
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

export default FormLsk;
