import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import Input from 'react-toolbox/lib/input';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './secondPassphraseInput.css';

class SecondPassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = { inputType: 'password' };
  }

  componentDidMount() {
    if (this.props.hasSecondPassphrase) {
      this.props.onChange('');
    }
  }

  handleValueChange(value) {
    let error;
    if (!value) {
      error = 'Required';
    } else if (!isValidPassphrase(value)) {
      error = 'Invalid passphrase';
    }
    this.props.onChange(value, error);
  }

  setInputType(event) {
    this.setState({ inputType: event.target.checked ? 'text' : 'password' });
  }

  render() {
    return (this.props.hasSecondPassphrase ?
      <div className={styles.wrapper}>
        <Input
          label='Second Passphrase'
          required={true}
          type={this.state.inputType}
          className='second-passphrase'
          error={this.props.error}
          value={this.props.value}
          onChange={this.handleValueChange.bind(this)} />
        <label htmlFor='input-type' className={styles.label}>
          <FontIcon value='remove_red_eye' />
          <input
            id='input-type'
            className={styles.checkbox}
            type={'checkbox'}
            onChange={this.setInputType.bind(this)} />
        </label>
      </div> :
      null);
  }
}

export default SecondPassphraseInput;

