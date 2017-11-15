import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton, IconButton as ToolBoxIconButton } from 'react-toolbox/lib/button';
import primaryButtonTheme from './primaryButton.css';

class Button extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class IconButton extends React.Component {
  render() {
    return <ToolBoxIconButton {...this.props} theme={this.props.theme} />;
  }
}

export { IconButton };
export default themr('primaryButton', primaryButtonTheme)(Button);
