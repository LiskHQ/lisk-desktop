import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import secondaryBlueButtonTheme from './css/secondaryBlueButton.css';
import secondaryLightButtonTheme from './css/secondaryLightButton.css';
import primaryButtonTheme from './css/primaryButton.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import actionButtonTheme from './css/actionButton.css';

class TBSecondaryBlueButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBPrimaryButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBSecondaryLightButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBTertiaryButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}

class TBActionButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme}/>;
  }
}


const PrimaryButton = themr('importantButton', primaryButtonTheme)(TBPrimaryButton);
const SecondaryLightButton = themr('lightButton', secondaryLightButtonTheme)(TBSecondaryLightButton);
const TertiaryButton = themr('tertiaryButton', tertiaryButtonTheme)(TBTertiaryButton);
const ActionButton = themr('actionButton', actionButtonTheme)(TBActionButton);
const Button = themr('button', secondaryBlueButtonTheme)(TBSecondaryBlueButton);

export { Button, PrimaryButton, SecondaryLightButton, TertiaryButton, ActionButton };
export default Button;
