import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import primaryButtonTheme from './css/primaryButton.css';
import importantButtonTheme from './css/importantButton.css';
import lightButtonTheme from './css/lightButton.css';

class TBButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBImportantButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBLightButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

const ImportantButton = themr('importantButton', importantButtonTheme)(TBImportantButton);
const LightButton = themr('lightButton', lightButtonTheme)(TBLightButton);
const Button = themr('primaryButton', primaryButtonTheme)(TBButton);

export { Button, ImportantButton, LightButton };
export default Button;
