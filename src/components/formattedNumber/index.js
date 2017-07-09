import React from 'react';
/**
 *
 * @param {*} num - it is a number that we want to formate it as formatted number
 * @return {string} - formatted version of input number
 */
const formateNumber = (num) => {
  num = parseFloat(num);
  const sign = num < 0 ? '-' : '';
  const absVal = String(parseInt(num = Math.abs(Number(num) || 0), 10));
  let remaining = absVal.length;
  remaining = (remaining) > 3 ? remaining % 3 : 0;
  const intPart = sign + (remaining ? `${absVal.substr(0, remaining)},` : '') +
     absVal.substr(remaining).replace(/(\d{3})(?=\d)/g, '$1,');
  const floatPart = num.toString().split('.')[1];
  num = floatPart ? `${intPart}.${floatPart || ''}` : intPart;
  return num;
};
const FormattedNumber = (props) => {
  const formatedNumber = formateNumber(props.val);
  return <span>{formatedNumber}</span>;
};

export default FormattedNumber;
