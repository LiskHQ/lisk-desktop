import React from 'react';
import BigNumber from 'bignumber.js';
import FormattedNumber from '../formattedNumber';

/**
 *
 * @param {*} num - it is a number that we want to normalize it
 * @return {string} - normalized version of input number
 */
const normalize = value => new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();

const LiskValue = props => (<FormattedNumber val={parseFloat(normalize(props.val))} />);

export default LiskValue;

