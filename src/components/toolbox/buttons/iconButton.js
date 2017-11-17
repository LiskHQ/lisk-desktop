import React from 'react';
import { themr } from 'react-css-themr';
import { IconButton as ToolBoxIconButton } from 'react-toolbox/lib/button';
import iconButtonTheme from './css/iconButton.css';

class IconButton extends React.Component {
  render() {
    return <ToolBoxIconButton {...this.props} theme={this.props.theme} />;
  }
}

export default themr('iconButton', iconButtonTheme)(IconButton);
