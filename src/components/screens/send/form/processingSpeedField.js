import React from 'react';
import {
  formatAmountBasedOnLocale,
} from '../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import Selector from '../../../toolbox/selector/selector';
import Spinner from '../../../toolbox/spinner';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './form.css';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';
import useRecipientField from './useRecipientField';

const ProcessingSpeedField = ({
  t, transaction, type, token,
}) => {
  return (
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
  );
};

export default ProcessingSpeedField;
