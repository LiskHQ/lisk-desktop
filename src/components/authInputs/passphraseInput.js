import React from 'react';
import Input from 'react-toolbox/lib/input';
import Tooltip from 'react-toolbox/lib/tooltip';
import { IconButton } from 'react-toolbox/lib/button';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';

// eslint-disable-next-line new-cap
const TooltipIconButton = Tooltip(IconButton);

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = { inputType: 'password' };
  }

  handleValueChange(name, value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = 'Invalid passphrase';
    }
    this.props.onChange(name, value, error);
  }

  toggleInputType() {
    this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Input label={this.props.label} required={true}
          className={this.props.className}
          error={this.props.error}
          value={this.props.value}
          type={this.state.inputType}
          onChange={this.handleValueChange.bind(this, this.props.className)} />
        <TooltipIconButton className={styles.eyeIcon}
          tooltipPosition='horizontal'
          tooltip={this.state.inputType === 'password' ? 'Show passphrase' : 'Hide passphrase'}
          icon='remove_red_eye'
          onClick={this.toggleInputType.bind(this)}/>
      </div>);
  }
}

export default PassphraseInput;

