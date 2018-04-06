import React from 'react';
import Input from 'react-toolbox/lib/input';
import { themr } from 'react-css-themr';
import inputTheme from './input.css';

const ToolBoxInput = props => <Input
  {...props}
  theme={props.theme}
  innerRef={(ref) => {
    if (ref !== null && props.shouldfocus) {
      ref.focus();
    }
  }}
/>;

export default themr('TBInput', inputTheme)(ToolBoxInput);
