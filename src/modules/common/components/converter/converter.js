import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
import i18n from 'src/utils/i18n/i18n';
import DiscreetMode from '@common/components/discreetMode';
import styles from './converter.css';

const Converter = ({
  currency,
  value,
  error,
  className = '',
  token,
  priceTicker,
  Wrapper = DiscreetMode,
}) => {
  const ratio = priceTicker[token][currency];
  const numericValue = numeral(value).value();

  numeral.locale(i18n.language);

  let price = error || Number.isNaN(numericValue) ? 0 : numericValue * ratio;
  price = Number.isNaN(price) || price < 0 ? 0 : numeral(price).format('0,0.00');

  return (
    <Wrapper className={`${styles.wrapper} ${className}`}>
      {value !== '' && ratio ? (
        <span className={`${styles.price} converted-price`}>{`~${price} ${currency}`}</span>
      ) : null}
    </Wrapper>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.value === nextProps.value &&
  prevProps.priceTicker[prevProps.token][prevProps.currency] ===
    nextProps.priceTicker[nextProps.token][nextProps.currency] &&
  prevProps.isLoading === nextProps.isLoading;

export default React.memo(Converter, areEqual);
