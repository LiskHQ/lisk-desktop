import React from 'react';
import { fromRawLsk } from '../../utils/lsk';
import FormattedNumber from '../formattedNumber';

const LiskValue = props => (<FormattedNumber val={parseFloat(fromRawLsk(props.val))} />);

export default LiskValue;

