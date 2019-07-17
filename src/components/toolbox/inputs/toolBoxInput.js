import React from 'react';
import Input from 'react-toolbox/lib/input';
import { themr } from 'react-css-themr';
import inputTheme from './input.css';

const ToolBoxInput = props => (
  <Input
    {...props}
    theme={props.theme}
  >
    {props.children}
  </Input>
);

export default themr('TBInput', inputTheme)(ToolBoxInput);
