import React from 'react';
import converter from '../../constants/converter';
import styles from './converter.css';

class Converter extends React.Component {
  constructor(props) {
    super(props);

    props.pricesRetrieved();
  }

  render() {
    const {
      settings, value, error, className = '', token, priceTicker,
    } = this.props;
    const currencies = priceTicker[token];

    const currency = settings.currency || 'USD';

    let price = error && Number.isNaN(value)
      ? (0).toFixed(2) : (value * currencies[currency]).toFixed(2);

    price = price > converter.maxLSKSupply || price === 'NaN' || price < 0 ? (0).toFixed(2) : price;

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {value !== '' && currencies[currency]
          ? (
            <span className={`${styles.price} converted-price`}>
              {`~${price} ${currency}`}
            </span>
          )
          : null
        }
      </div>
    );
  }
}

export default Converter;
