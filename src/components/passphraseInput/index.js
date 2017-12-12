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
      inputFields: [],
      inputType: 'password',
      isFocused: false,
      partialPassphraseError: [],
    };
  }


  setInputFields() {
    return new Promise((resolve) => {
      if (this.state.isFocused && this.state.inputFields.length === 0) {
        const inputFields = document.querySelectorAll(`.${this.props.className}`);
        this.setState({ inputFields });
        resolve();
      }
    });
  }

  handleValueChange(value, index) {
    let insertedValue = value;
    const insertedValueAsArray = insertedValue.split(' ');
    let passphrase = this.props.value.split(' ');

    if (insertedValueAsArray.length > 1) {
      for (let i = 0; i < 12; i++) {
        if (insertedValueAsArray[i]) {
          passphrase[i] = insertedValueAsArray[i];
          this.state.inputFields[i].firstElementChild.focus();
        }
      }
      insertedValue = insertedValueAsArray[index];
    }

    passphrase[index] = insertedValue;
    passphrase = passphrase.join(' ');

    let error;

    this.setState({ partialPassphraseError: [] });
    if (!passphrase) {
      error = this.props.t('Required');
    } else if (!isValidPassphrase(passphrase)) {
      error = this.getPassphraseValidationError(passphrase);
    } else if (this.hasExtraWhitespace(passphrase)) {
      error = this.getPassphraseWhitespaceError(passphrase);
    }
    this.props.onChange(passphrase, error);
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseValidationError(passphrase) {
    const mnemonic = passphrase.trim().split(' ');

    const partialPassphraseError = this.state.partialPassphraseError.slice();
    const invalidWords = mnemonic.filter((word) => {
      const isNotInDictionary = !inDictionary(word.toLowerCase());
      partialPassphraseError[mnemonic.indexOf(word)] = isNotInDictionary;
      return isNotInDictionary;
    });
    this.setState({ partialPassphraseError });

    if (invalidWords.length > 0) {
      return this.props.t('Please check the highlighted words');
    }

    if (mnemonic.length < 12) {
      return this.props.t('Passphrase should have 12 words, entered passphrase has {{length}}', { length: mnemonic.length });
    }

    return this.props.t('Passphrase is not valid');
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
    return new Promise((resolve) => {
      this.setState({ isFocused: true });
      resolve();
    });
  }

  doNext({ event, index }) {
    if (event.which === 32) {
      event.preventDefault();
      const nextElement = this.state.inputFields[index + 1];
      if (nextElement && nextElement.focus) {
        nextElement.firstElementChild.focus();
      }
    }
  }

  doDelete({ event, index }) {
    if (event.which === 8) {
      const currentElement = this.state.inputFields[index];
      const previousElement = this.state.inputFields[index - 1];
      if (previousElement && previousElement.focus && !currentElement.childNodes[0].value) {
        previousElement.firstElementChild.focus();
      }
    }
  }

  renderFields() {
    const propsColumns = this.props.columns;
    const xs = `col-xs-${propsColumns && propsColumns.xs ? propsColumns.xs : '6'}`;
    const sm = `col-sm-${propsColumns && propsColumns.sm ? propsColumns.sm : '2'}`;
    const md = `col-md-${propsColumns && propsColumns.md ? propsColumns.md : '2'}`;

    const value = this.props.value.split(' ');
    const indents = [];

    for (let i = 0; i < 12; i++) {
      indents.push(
        <div className={`${grid[xs]} ${grid[sm]} ${grid[md]}`} key={i}>
          <PassphrasePartial
            onFocus={this.props.onFocus}
            type={this.state.inputType}
            theme={this.props.theme}
            value={value}
            partialValue={value[i]}
            onChange={this.handleValueChange.bind(this)}
            index={i}
            className={this.props.className}
            error={this.state.partialPassphraseError[i]}
            doNext={this.doNext.bind(this)}
            doDelete={this.doDelete.bind(this)}
          />
        </div>);
    }

    return indents;
  }

  focusAndPaste(value) {
    // will fix this in next ticket
    this.setFocused().then(() => {
      this.setInputFields().then(() => {
        this.handleValueChange(value);
      });
    });
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
            onChange={this.focusAndPaste.bind(this)}
          />
        }
      </div>);
  }
}

export default translate()(PassphraseInput);
