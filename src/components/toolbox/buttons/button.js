import React from 'react';
import { themr } from 'react-css-themr';
import { Button as ToolBoxButton } from 'react-toolbox/lib/button';
import secondaryBlueButtonTheme from './css/secondaryBlueButton.css';
import primaryButtonV2Theme from './css/primaryButtonV2.css';
import secondaryButtonV2Theme from './css/secondaryButtonV2.css';
import tertiaryButtonV2Theme from './css/tertiaryButtonV2.css';

class TBButton extends React.Component {
  render() {
    return <ToolBoxButton {...this.props} theme={this.props.theme} />;
  }
}

const PrimaryButtonV2 = themr('primaryButton', primaryButtonV2Theme)(TBButton);
const SecondaryButtonV2 = themr('secondarytButton', secondaryButtonV2Theme)(TBButton);
const TertiaryButtonV2 = themr('tertiaryButton', tertiaryButtonV2Theme)(TBButton);
const Button = themr('button', secondaryBlueButtonTheme)(TBButton);

export {
  Button,
  PrimaryButtonV2,
  SecondaryButtonV2,
  TertiaryButtonV2,
};
export default Button;
