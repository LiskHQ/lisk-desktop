import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
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
    const ratio = priceTicker[token][settings.currency];
    const numericValue = numeral(value).value();

    numeral.locale(i18n.language);

    let price = error || Number.isNaN(numericValue) ? 0 : (numericValue * ratio);
    price = Number.isNaN(price) || price < 0 ? 0 : numeral(price).format('0,0.00');

    return (
      <div className={`${styles.wrapper} ${className}`}>
        {value !== '' && ratio
          ? (
            <span className={`${styles.price} converted-price`}>
              {`~${price} ${settings.currency}`}
            </span>
          )
          : null
        }
      </div>
    );
  }
}

export default Converter;
