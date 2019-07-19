import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import primaryButtonTheme from './css/primaryButton.css';
import secondaryButtonTheme from './css/secondaryButton.css';
import tertiaryButtonTheme from './css/tertiaryButton.css';

class TBButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme} />;
  }
}

const PrimaryButton = themr('primaryButton', primaryButtonTheme)(TBButton);
const SecondaryButton = themr('secondarytButton', secondaryButtonTheme)(TBButton);
const TertiaryButton = themr('tertiaryButton', tertiaryButtonTheme)(TBButton);
const Button = themr('button', primaryButtonTheme)(TBButton);

export {
  Button,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
};
export default Button;
