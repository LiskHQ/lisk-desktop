import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { themr } from 'react-css-themr';
import { FontIcon } from '../../fontIcon';
import theme from './dropdown.css';

const ToolBoxDropdown = props => <Dropdown {...props} theme={props.theme}>
  <FontIcon className={theme.arrow} value='arrow-down'/>
</Dropdown>;

export default themr('TBDropdown', theme)(ToolBoxDropdown);
