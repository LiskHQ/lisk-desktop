import React from 'react';
import liskServiceApi from '../../utils/api/liskService';
import Input from '../toolbox/inputs/input';
import { fromRawLsk } from '../../utils/lsk';

import fees from './../../constants/fees';
import converter from './../../constants/converter';

import styles from './converter.css';

class Converter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LSK: {
        USD: '0',
        EUR: '0',
      },
      // 0 index is active one
      currencies: ['USD', 'EUR'],
    };
    this.fee = fees.send;

    this.updateData();
  }

  componentDidMount() {
    const { settings } = this.props;
    if (settings.currency) {
      this.selectActive(settings.currency);
    }
  }

  updateData() {
    liskServiceApi.getPriceTicker().then((response) => {
      this.setState({ ...response });
    }).catch((error) => {
      this.setState({ error });
    });
  }
  /*
   * It swaping clicked currency with active currency on index 0
   */
  selectActive(currency) {
    const currencyIndex = this.state.currencies.indexOf(currency);
    if (currencyIndex !== 0) {
      const currencies = this.state.currencies;

      currencies.push(currencies.shift(currencies[currencyIndex]));
      this.setState({ currencies });
      this.props.settingsUpdated({ currency });
    }
  }

  render() {
    const { LSK, currencies } = this.state;

    let price = !!this.props.error && Number.isNaN(this.props.value) ?
      (0).toFixed(2) : (this.props.value * LSK[currencies[0]]).toFixed(2);
    price = price > converter.maxLSKSupply || price === 'NaN' || price < 0 ? (0).toFixed(2) : price;

    const currenciesObejects = currencies.map((currency, key) => (
      <div
        key={`${currency}-${key}`}
        className={`${styles.convertElem} converted-currency`}
        // eslint-disable-next-line
        onClick={() => { this.selectActive(currency); }}>{currency}</div>
    ));
    // putting <div>|</div> inbetween array objects
    const intersperse = currenciesObejects
      .reduce((a, v, key) => [...a, v, <div key={key}>|</div>], []) // eslint-disable-line
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
          {this.props.value !== '' && this.state.LSK[currencies[0]] ?
            <div className={this.props.error ? `${styles.convertorErr} convertorErr` : `${styles.convertor} convertor`}>
              <div className={`${styles.convertElem} converted-price`}>~ {price}</div>
              {intersperse}
            </div>
            : <div></div>
          }
        </div>
        { this.props.isRequesting ? null : <div className={styles.fee}> {this.props.t('Fee: {{fee}} LSK', { fee: fromRawLsk(this.fee) })} </div> }
      </Input>
    );
  }
}

export default Converter;

