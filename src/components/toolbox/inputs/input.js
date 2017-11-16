import React from 'react';
import Input from 'react-toolbox/lib/input';
import { themr } from 'react-css-themr';
import inputTheme from './input.css';

const ToolBoxInput = props => <Input {...props}/>;

// export default ToolBoxInput;
export default themr('input1', inputTheme)(ToolBoxInput);
