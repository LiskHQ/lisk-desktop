import React from 'react';
import liskServiceApi from '../../utils/api/liskService';
import Input from '../toolbox/inputs/input';
import { fromRawLsk } from '../../utils/lsk';
import fees from './../../constants/fees';

import styles from './converter.css';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LSK: {},
      // 0 index is active one
      currencies: ['USD', 'EUR'],
    };
    this.fee = fees.send;
    this.updateData();
  }

  updateData() {
    liskServiceApi.getPriceTicker().then((response) => {
      this.setState({ ...response });
    }).catch((error) => {
      this.setState({ error });
    });
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
    const price = this.props.error ?
      (0).toFixed(2) : (this.props.value * LSK[currencies[0]]).toFixed(2);

    const currenciesObejects = currencies.map((currency, key) =>
      (<div
        key={`${currency}-${key}`}
        className={`${styles.convertElem} convertElem`}
        // eslint-disable-next-line
        onClick={() => { this.selectActive(currency); }}>{currency}</div>)
    );
    // putting <div>|</div> inbetween array objects
    const intersperse = currenciesObejects
      .reduce((a, v) => [...a, v, <div>|</div>], []) // eslint-disable-line
      .slice(0, -1);
    return (
      <Input
        label={this.props.label}
        className='amount'
        error={this.props.error}
        value={this.props.value}
        theme={styles}
        onChange={this.props.onChange} >
        <div className={styles.convertorWrapper}>
          {this.props.value !== '' ?
            <div className={this.props.error ? `${styles.convertorErr} convertorErr` : `${styles.convertor} convertor`}>
              <div className={`${styles.convertElem} convertElem`}>~ {price}</div>
              {intersperse}
            </div>
            : <div></div>
          }
        </div>
        <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: fromRawLsk(this.fee) })} </div>
      </Input>
    );
  }
}

export default Converter;

