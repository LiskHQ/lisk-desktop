import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import Input from '../toolbox/inputs/input';
import PassphrasePartial from './../passphrasePartial';
import { findSimilarWord, inDictionary } from '../../utils/similarWord';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';
import { TooltipWrapper } from '../timestamp';

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = {
      inputType: 'password',
      isFocused: false,
      value: [],
      indents: [],
    };
  }

  handleValueChange(value) {
    let error;

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

    const invalidWord = mnemonic.find(word => !inDictionary(word.toLowerCase()));
    if (invalidWord) {
      if (invalidWord.length >= 2 && invalidWord.length <= 8) {
        const validWord = findSimilarWord(invalidWord);
        if (validWord) {
          return this.props.t('Word "{{invalidWord}}" is not on the passphrase Word List. Most similar word on the list is "{{similarWord}}"', { invalidWord, similarWord: findSimilarWord(invalidWord) });
        }
      }
      return this.props.t('Word "{{invalidWord}}" is not on the passphrase Word List.', { invalidWord });
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
    this.setState({ isFocused: true });
  }

  renderFields() {
    const indents = [];
    for (let i = 0; i < 12; i++) {
      indents.push(
        <div className={`${grid['col-xs-6']} ${grid['col-sm-2']} ${grid['col-md-1']}`} key={i}>
          <PassphrasePartial
            type={this.state.inputType}
            theme={this.props.theme}
            onFocus={typeof this.props.onFocus === 'function' ? this.props.onFocus : undefined}
            onBlur={typeof this.props.onBlur === 'function' ? this.props.onBlur : undefined}
            value={this.state.value}
            partialValue={this.state.value[i]}
            onChange={this.handleValueChange.bind(this)}
            index={i}
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
            <div className='error' style={{ color: '#DA1D00', fontSize: '14px', height: '20px', fontWeight: '600' }}>{this.props.error}</div>
            <div className={styles.inputTypeToggle} onClick={this.toggleInputType.bind(this)}>
              <TooltipIconButton className={`show-passphrase-toggle ${styles.eyeIcon}`}
                tooltipPosition='horizontal'
                tooltip={this.state.inputType === 'password' ? this.props.t('Show passphrase') : this.props.t('Hide passphrase')}
                icon={this.state.inputType === 'password' ? 'visibility' : 'visibility_off'}
              /><label>{this.state.inputType === 'password' ? 'Show' : 'Hide' } Passphrase</label>
            </div>
          </div>
          :
          <div>
            <Input label={this.props.label}
              className={`${this.props.className} ${styles.inputWrapper}`}
              type={this.state.inputType}
              theme={this.props.theme}
            />
          </div>
        }
      </div>);
  }
}

export default translate()(PassphraseInput);
