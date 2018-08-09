import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import { themr } from 'react-css-themr';
import { FontIcon } from '../../fontIcon';
import theme from './dropdown.css';

class ToolBoxDropdown extends React.Component {
  render() {
    return (
        <Dropdown
          {...this.props}
          theme={this.props.theme}
          innerRef={(ref) => { this.dropdownEl = ref; }}>
            <FontIcon
              className={theme.arrow}
               onClick={/* istanbul ignore next */ () => {
                 this.dropdownEl.open({ target: this.dropdownEl.inputNode.inputNode });
               }}
              value='arrow-down'/>
        </Dropdown>
    );
  }
}

export default themr('TBDropdown', theme)(ToolBoxDropdown);
