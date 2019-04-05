import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import secondaryBlueButtonTheme from './css/secondaryBlueButton.css';
import secondaryLightButtonTheme from './css/secondaryLightButton.css';
import primaryButtonTheme from './css/primaryButton.css';
import primaryButtonV2Theme from './css/primaryButtonV2.css';
import secondaryButtonV2Theme from './css/secondaryButtonV2.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';
import tertiaryButtonV2Theme from './css/tertiaryButtonV2.css';
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
const PrimaryButtonV2 = themr('dangerButton', primaryButtonV2Theme)(TBPrimaryButton);
const SecondaryLightButton = themr('lightButton', secondaryLightButtonTheme)(TBSecondaryLightButton);
const SecondaryButtonV2 = themr('lightButton', secondaryButtonV2Theme)(TBSecondaryLightButton);
const TertiaryButton = themr('tertiaryButton', tertiaryButtonTheme)(TBTertiaryButton);
const TertiaryButtonV2 = themr('tertiaryButton', tertiaryButtonV2Theme)(TBTertiaryButton);
const ActionButton = themr('actionButton', actionButtonTheme)(TBActionButton);
const Button = themr('button', secondaryBlueButtonTheme)(TBSecondaryBlueButton);

export {
  Button, PrimaryButton, SecondaryLightButton,
  TertiaryButton, ActionButton,
  PrimaryButtonV2, SecondaryButtonV2,
  TertiaryButtonV2,
};
export default Button;
