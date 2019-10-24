import React from 'react';
import * as btcTransactionsAPI from '../../../../../utils/api/btc/transactions';
import { fromRawLsk, toRawLsk } from '../../../../../utils/lsk';
import { formatAmountBasedOnLocale } from '../../../../../utils/formattedNumber';
import FormBase from './formBase';
import Selector from '../../../../toolbox/selector/selector';
import Spinner from '../../../../toolbox/spinner';
import Tooltip from '../../../../toolbox/tooltip/tooltip';
import styles from './form.css';

function getInitialState() {
  return {
    isLoading: false,
    fields: {
      processingSpeed: {
        value: 0,
        loaded: false,
        txFee: 0,
        selectedIndex: 0,
      },
      amount: {
        value: '',
      },
      fee: {
        value: 0,
      },
    },
    unspentTransactionOutputs: [],
  };
}

export default class FormBtc extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    this.getProcessingSpeedStatus = this.getProcessingSpeedStatus.bind(this);
    this.selectProcessingSpeed = this.selectProcessingSpeed.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.props.dynamicFeesRetrieved();
  }

  componentDidUpdate() {
    const { fields, unspentTransactionOutputs } = this.state;
    const {
      token, account, dynamicFees, networkConfig,
    } = this.props;
    if (!Object.keys(dynamicFees).length) this.props.dynamicFeesRetrieved();
    if (account && account.info[token]
        && !unspentTransactionOutputs.length) {
      btcTransactionsAPI
        .getUnspentTransactionOutputs(account.info[token].address, networkConfig)
        .then(data => this.setState(() => ({ unspentTransactionOutputs: data })))
        .catch(() => this.setState(() => ({ unspentTransactionOutputs: [] })));
    }

    if (!fields.processingSpeed.loaded && dynamicFees.Low) {
      this.setState(() => ({
        fields: {
          ...fields,
          processingSpeed: {
            value: dynamicFees.Low,
            loaded: true,
            txFee: this.getCalculatedDynamicFee(dynamicFees.Low),
          },
        },
      }));
    }
  }

  updateFee() {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        processingSpeed: {
          ...fields.processingSpeed,
          txFee: this.getCalculatedDynamicFee(fields.processingSpeed.value),
        },
      },
    }));
  }

  onInputChange({ target }, newState) {
    if (target.name === 'amount') {
      this.setState(({ fields }) => ({
        fields: {
          ...fields,
          [target.name]: newState,
        },
      }), this.updateFee);
    }
  }

  /**
   * Get status of processing soeed fetch based on state of component
   * @returns {Node} - Text to display to the user or loader
   */
  getProcessingSpeedStatus() {
    const { token, t } = this.props;
    const { fields, isLoading } = this.state;
    const { amount } = fields;
    if (amount.value === '') return '-';
    if (isLoading) {
      return (
        <React.Fragment>
          {t('Loading')}
          {' '}
          <Spinner className={styles.loading} />
        </React.Fragment>
      );
    }
    const fee = formatAmountBasedOnLocale({ value: fromRawLsk(fields.processingSpeed.txFee) });

    return !amount.error
      ? `${fee} ${token}`
      : t('Invalid amount');
  }

  // TODO move dynamic fee calculation and presentation to a separate component
  getCalculatedDynamicFee(dynamicFeePerByte) {
    const { fields: { amount }, unspentTransactionOutputs } = this.state;
    if (amount.error) {
      return 0;
    }
    const feeInSatoshis = btcTransactionsAPI.getTransactionFeeFromUnspentOutputs({
      unspentTransactionOutputs,
      satoshiValue: toRawLsk(amount.value),
      dynamicFeePerByte,
    });

    return feeInSatoshis;
  }

  selectProcessingSpeed({ item, index }) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        processingSpeed: {
          ...fields.processingSpeed,
          ...item,
          selectedIndex: index,
          txFee: this.getCalculatedDynamicFee(item.value),
        },
      },
    }));
  }

  render() {
    const {
      t, dynamicFees,
    } = this.props;
    const { fields } = this.state;
    return (
      <FormBase
        {...this.props}
        extraFields={fields}
        onInputChange={this.onInputChange}
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
            onSelectorChange={this.selectProcessingSpeed}
            name="speedSelector"
            selectedIndex={fields.processingSpeed.selectedIndex}
            options={[
              { title: t('Low'), value: dynamicFees.Low },
              { title: t('High'), value: dynamicFees.High },
            ]}
          />
          <span className={styles.processingInfo}>
            {`${t('Transaction fee')}: `}
            <span>{this.getProcessingSpeedStatus()}</span>
          </span>
        </div>
      </FormBase>
    );
  }
}
