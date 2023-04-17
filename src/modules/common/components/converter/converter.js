import React from 'react';
import numeral from 'numeral';
import 'numeral/locales';
import i18n from 'src/utils/i18n/i18n';
import DiscreetMode from '@common/components/discreetMode';
import styles from './converter.css';
import useFiatRates from '../../hooks/useFiatRates';

const Converter = ({
  currency,
  value,
  tokenSymbol,
  emptyPlaceholder = null,
  className = '',
  Wrapper = DiscreetMode,
}) => {
  const priceTicker = useFiatRates();
  const ratio = priceTicker[tokenSymbol]?.[currency] || 0;
  const numericValue = numeral(value).value();

  numeral.locale(i18n.language);

  let price = Number.isNaN(numericValue) ? 0 : numericValue * ratio;
  price = Number.isNaN(price) || price < 0 ? 0 : numeral(price).format('0,0.00');

  if (!priceTicker[tokenSymbol]?.[currency] || !price) return <span>{emptyPlaceholder}</span>;

  return (
    <Wrapper className={`${styles.wrapper} ${className}`}>
      {value !== '' && !!ratio && (
        <span className={`${styles.price} converted-price`}>{`~${price} ${currency}`}</span>
      )}
    </Wrapper>
  );
};

export default Converter;
