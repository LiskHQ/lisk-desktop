import React from 'react';

/**
 *
 * @param {*} num - it is a number that we want to format it as formatted number
 * @return {string} - formatted version of input number
 */
const formatNumber = (num) => {
  let normalizeNum = parseFloat(num);
  const sign = normalizeNum < 0 ? '-' : '';
  const absVal = String(parseInt(normalizeNum = Math.abs(Number(normalizeNum) || 0), 10));
  let remaining = absVal.length;
  remaining = (remaining) > 3 ? remaining % 3 : 0;
  const intPart = sign + (remaining ? `${absVal.substr(0, remaining)},` : '') +
     absVal.substr(remaining).replace(/(\d{3})(?=\d)/g, '$1,');
  const floatPart = normalizeNum.toString().split('.')[1];
  normalizeNum = floatPart ? `${intPart}.${floatPart || ''}` : intPart;
  return normalizeNum;
};
const FormattedNumber = (props) => {
  const formatedNumber = formatNumber(props.val);
  return <span>{formatedNumber}</span>;
};

export default FormattedNumber;
