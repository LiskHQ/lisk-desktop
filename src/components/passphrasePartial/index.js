import { translate } from 'react-i18next';
import React from 'react';
import Input from '../toolbox/inputs/input';

// import styles from './passphraseInput.css';

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = {
      inputType: 'password',
      value: '',
    };
  }

  handleValueChange(value) {
    this.setState({ value });
    this.props.value[this.props.index] = value;
    const passphrase = this.props.value.join(' ');
    this.props.onChange(passphrase);
  }

  handlePaste(e) {
    e.preventDefault();
    const clipBoardText = e.clipboardData.getData('Text');
    let value = clipBoardText;

    const passphraseArray = clipBoardText.split(' ');
    if (passphraseArray.length > 1) {
      for (let i = 0; i < 12; i++) {
        this.props.value[i] = passphraseArray[i];
      }
      value = passphraseArray[this.props.index];
    }
    this.handleValueChange(value);
  }

  doNext(event) {
    if (event.which === 32) {
      event.preventDefault();
      const nextEl = document.querySelectorAll('.passphrase')[this.props.index + 1];
      if (nextEl && nextEl.focus) {
        nextEl.firstElementChild.focus();
      }
    }
  }

  render() {
    return (<Input
      autoFocus={this.props.index === 0}
      placeHolder={this.props.index === 0 ? 'start here' : ''}
      onPaste={this.handlePaste.bind(this)}
      className='passphrase'
      value={this.props.partialValue || this.state.value}
      type={this.props.type}
      theme={this.props.theme}
      onFocus={typeof this.props.onFocus === 'function' ? this.props.onFocus : undefined}
      onBlur={typeof this.props.onBlur === 'function' ? this.props.onBlur : undefined}
      onChange={this.handleValueChange.bind(this)}
      style={{ textAlign: 'center' }}
      onKeyPress={this.doNext.bind(this)}
    />);
  }
}

export default translate()(PassphraseInput);
