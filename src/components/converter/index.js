import React from 'react';
import liskServiceApi from '../../utils/api/liskService';
import Input from '../toolbox/inputs/input';
import { fromRawLsk } from '../../utils/lsk';
import fees from './../../constants/fees';
import { authStatePrefill } from '../../utils/form';
import regex from './../../utils/regex';

import styles from './converter.css';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LSK: {},
      // 0 index is active one
      currencies: ['USD', 'EUR'],
      recipient: {
        value: this.props.address || '',
      },
      amount: {
        value: this.props.amount || '',
      },
      ...authStatePrefill(),
    };
    this.fee = fees.send;
    this.inputValidationRegexps = {
      recipient: regex.address,
      amount: regex.amount,
    };
    this.updateData();
  }

  componentDidMount() {
    if (this.props.prevState) {
      const newState = {
        recipient: {
          value: this.props.prevState.recipient || this.state.recipient.value,
        },
        amount: {
          value: this.props.prevState.amount || this.state.amount.value,
        },
        ...authStatePrefill(this.props.account),
      };
      this.setState(newState);
    }
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : this.validateInput(name, value),
      },
    });
  }

  updateData() {
    liskServiceApi.getPriceTicker().then((response) => {
      this.setState({ ...response });
    }).catch((error) => {
      this.setState({ error });
    });
  }

  validateInput(name, value) {
    if (!value) {
      return this.props.t('Required');
    } else if (!value.match(this.inputValidationRegexps[name])) {
      return name === 'amount' ? this.props.t('Invalid amount') : this.props.t('Invalid address');
    } else if (name === 'amount' && value > parseFloat(this.getMaxAmount())) {
      return this.props.t('Not enough LSK');
    } else if (name === 'amount' && value === '0') {
      return this.props.t('Zero not allowed');
    }
    return undefined;
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - this.fee));
  }

  selectActive(currency) {
    const currencyIndex = this.state.currencies.indexOf(currency);
    if (currencyIndex !== 0) {
      const currencies = this.state.currencies;
      const currencyA = currencies[currencyIndex];
      currencies[currencyIndex] = currencies[0];
      currencies[0] = currencyA;
      this.setState({ currencies });
    }
  }

  render() {
    const { LSK, currencies } = this.state;
    const price = this.state.amount.error ?
      (0).toFixed(2) : (this.state.amount.value * LSK[currencies[0]]).toFixed(2);

    const currenciesObejects = currencies.map((currency, key) =>
      (<div
        key={`${currency}-${key}`}
        className={styles.convertElem}
        // eslint-disable-next-line
        onClick={() => { this.selectActive(currency); }}>{currency}</div>)
    );
    // putting <div>|</div> inbetween array objects
    const intersperse = currenciesObejects
      .reduce((a, v) => [...a, v, <div>|</div>], []) // eslint-disable-line
      .slice(0, -1);
    return (
      <Input label={this.props.t('Amount (LSK)')}
        className='amount'
        error={this.state.amount.error}
        value={this.state.amount.value}
        theme={styles}
        onChange={this.handleChange.bind(this, 'amount')} >
        <div className={styles.convertorWrapper}>
          <div className={this.state.amount.error ? styles.convertorErr : styles.convertor}>
            <div className={styles.convertElem}>{price}</div>
            {intersperse}
          </div>
        </div>
        <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: fromRawLsk(this.fee) })} </div>
      </Input>
    );
  }
}

export default Converter;

