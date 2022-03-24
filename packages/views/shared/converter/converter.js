import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
import i18n from '@setup/i18n/i18n';
import styles from './converter.css';

const Converter = ({
  currency,
  value,
  error,
  className = '',
  token,
  priceTicker,
}) => {
  const ratio = priceTicker[token][currency];
  const numericValue = numeral(value).value();

  numeral.locale(i18n.language);

  let price = error || Number.isNaN(numericValue) ? 0 : (numericValue * ratio);
  price = Number.isNaN(price) || price < 0 ? 0 : numeral(price).format('0,0.00');

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {value !== '' && ratio
        ? (
          <span className={`${styles.price} converted-price`}>
            {`~${price} ${currency}`}
          </span>
        )
        : null}
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (
  prevProps.value === nextProps.value
  && prevProps.priceTicker[prevProps.token][prevProps.currency]
    === nextProps.priceTicker[nextProps.token][nextProps.currency]
  && prevProps.isLoading === nextProps.isLoading
);

export default React.memo(Converter, areEqual);
