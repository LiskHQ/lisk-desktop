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

  render() {
    const { LSK } = this.state;
    const currency = this.props.settings.currency || 'USD';

    let price = !!this.props.error && Number.isNaN(this.props.value) ?
      (0).toFixed(2) : (this.props.value * LSK[currency]).toFixed(2);
    price = price > converter.maxLSKSupply || price === 'NaN' || price < 0 ? (0).toFixed(2) : price;
    return (
      <Input
        label={this.props.label}
        className='amount'
        error={this.props.error}
        value={this.props.value}
        theme={styles}
        onChange={this.props.onChange} >
        <div className={styles.convertorWrapper}>
          {this.props.value !== '' && this.state.LSK[currency] ?
            <div className={this.props.error ? `${styles.convertorErr} convertorErr` : `${styles.convertor} convertor`}>
              <div className={`${styles.convertElem}`}>
                {this.props.t('ca.')}
                <div className='converted-price'>{price} {currency}</div>
              </div>
            </div>
            : <div></div>
          }
        </div>
        { this.props.isRequesting || this.props.error ? null :
          <div className={styles.fee}>{this.props.t('Additional fee: {{fee}} LSK', { fee: fromRawLsk(this.fee) })}
          {`, ${this.props.t('ca. {{price}} {{currency}}', {
            currency,
            price: (fromRawLsk(this.fee) * LSK[currency]).toFixed(2),
          })}`}</div> }
      </Input>
    );
  }
}

export default Converter;

