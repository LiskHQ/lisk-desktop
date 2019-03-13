import React from 'react';
import converter from '../../constants/converter';
import styles from './converterV2.css';

class ConverterV2 extends React.Component {
  constructor(props) {
    super(props);

    props.getPriceTicker();
  }

  render() {
    const {
      settings, value, error, className = '',
    } = this.props;
    const { LSK } = this.props.priceTicker;

    const currency = settings.currency || 'USD';

    let price = error && Number.isNaN(value)
      ? (0).toFixed(2) : (value * LSK[currency]).toFixed(2);

    price = price > converter.maxLSKSupply || price === 'NaN' || price < 0 ? (0).toFixed(2) : price;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {value !== '' && LSK[currency]
          ? <span className={`${styles.price} converted-price`}>~{price} {currency}</span>
          : null
        }
      </div>
    );
  }
}

export default ConverterV2;
