import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import Input from '../toolbox/inputs/input';
import PassphrasePartial from './../passphrasePartial';
import { inDictionary } from '../../utils/similarWord';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = {
      inputType: 'password',
      isFocused: false,
      value: [],
      partialPassphraseError: [],
    };
  }

  handleValueChange(value) {
    let error;

    this.setState({ partialPassphraseError: [] });
    if (!value) {
      error = this.props.t('Required');
    } else if (!isValidPassphrase(value)) {
      error = this.getPassphraseValidationError(value);
    } else if (this.hasExtraWhitespace(value)) {
      error = this.getPassphraseWhitespaceError(value);
    }
    this.props.onChange(value, error);
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseValidationError(passphrase) {
    const mnemonic = passphrase.trim().split(' ');
    if (mnemonic.length < 12) {
      return this.props.t('Passphrase should have 12 words, entered passphrase has {{length}}', { length: mnemonic.length });
    }

    const partialPassphraseError = this.state.partialPassphraseError.slice();
    const invalidWords = mnemonic.filter((word) => {
      const isNotInDictionary = !inDictionary(word.toLowerCase());
      partialPassphraseError[mnemonic.indexOf(word)] = isNotInDictionary;
      return isNotInDictionary;
    });
    this.setState({ partialPassphraseError });

    return invalidWords.length > 0 ? this.props.t('Please check the highlighted words') : this.props.t('Passphrase is not valid');
  }

  // eslint-disable-next-line class-methods-use-this
  hasExtraWhitespace(passphrase) {
    const normalizedValue = passphrase.replace(/ +/g, ' ').trim();
    return normalizedValue !== passphrase;
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseWhitespaceError(passphrase) {
    if (passphrase.replace(/^\s+/, '') !== passphrase) {
      return this.props.t('Passphrase contains unnecessary whitespace at the beginning');
    } else if (passphrase.replace(/\s+$/, '') !== passphrase) {
      return this.props.t('Passphrase contains unnecessary whitespace at the end');
    } else if (passphrase.replace(/\s+/g, ' ') !== passphrase) {
      return this.props.t('Passphrase contains extra whitespace between words');
    }

    return null;
  }

  toggleInputType() {
    this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
  }

  setFocused() {
    this.setState({ isFocused: true });
  }

  renderFields() {
    const indents = [];
    const mdSize = this.props.mdColumnSize ? `col-md-${this.props.mdColumnSize}` : 'col-md-2';
    const smSize = this.props.mdColumnSize ? `col-sm-${this.props.smColumnSize}` : 'col-sm-2';
    const xsSize = this.props.mdColumnSize ? `col-xs-${this.props.xsColumnSize}` : 'col-xs-6';

    for (let i = 0; i < 12; i++) {
      indents.push(
        <div className={`${grid[xsSize]} ${grid[smSize]} ${grid[mdSize]}`} key={i}>
          <PassphrasePartial
            type={this.state.inputType}
            theme={this.props.theme}
            onFocus={typeof this.props.onFocus === 'function' ? this.props.onFocus : undefined}
            onBlur={typeof this.props.onBlur === 'function' ? this.props.onBlur : undefined}
            value={this.state.value}
            partialValue={this.state.value[i]}
            onChange={this.handleValueChange.bind(this)}
            index={i}
            className={this.props.className}
            error={this.state.partialPassphraseError[i]}
          />
        </div>);
    }
    return indents;
  }

  render() {
    return (
      <div className={styles.wrapper} onClick={this.setFocused.bind(this)}>
        {this.state.isFocused
          ?
          <div>
            <div className={grid.row}>
              {this.renderFields()}
            </div>
            <div className={styles.errorMessage}>{this.props.error}</div>
            <div
              className={`show-passphrase-toggle ${styles.inputTypeToggle}`}
              onClick={this.toggleInputType.bind(this)}>
              <FontIcon className={styles.eyeIcon} value={this.state.inputType === 'password' ? 'hide' : 'show'}
              /> <label>{this.state.inputType === 'password' ? 'Show' : 'Hide' } Passphrase</label>
            </div>
          </div>
          :
          <Input label={this.props.label}
            className={`${this.props.className} ${styles.inputWrapper}`}
            type={this.state.inputType}
          />
        }
      </div>);
  }
}

export default translate()(PassphraseInput);
