import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
import converter from '../../../constants/converter';
import styles from './converter.css';
import i18n from '../../../i18n';

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

    numeral.locale(i18n.language);

    let price = error || Number.isNaN(numeral(value).value())
      ? 0
      : (numeral(value).value() * currencies[currency]);

    price = price > converter.maxLSKSupply || price === 'NaN' || price < 0 ? 0 : price;
    price = numeral(price).format('0,0.00');

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
