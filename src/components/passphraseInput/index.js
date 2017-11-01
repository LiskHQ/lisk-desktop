import { IconButton } from 'react-toolbox/lib/button';
import { translate } from 'react-i18next';
import Input from 'react-toolbox/lib/input';
import React from 'react';
import Tooltip from 'react-toolbox/lib/tooltip';

import { findSimilarWord, inDictionary } from '../../utils/similarWord';
import { isValidPassphrase } from '../../utils/passphrase';
import styles from './passphraseInput.css';

// eslint-disable-next-line new-cap
const TooltipIconButton = Tooltip(IconButton);

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.state = { inputType: 'password' };
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

  render() {
    return (
      <div className={styles.wrapper}>
        <Input label={this.props.label} required={true}
          className={`${this.props.className} ${styles.inputWrapper}`}
          error={this.props.error}
          value={this.props.value || ''}
          type={this.state.inputType}
          theme={this.props.theme}
          onChange={this.handleValueChange.bind(this)} />
        <TooltipIconButton className={`show-passphrase-toggle ${styles.eyeIcon}`}
          tooltipPosition='horizontal'
          tooltip={this.state.inputType === 'password' ?
            this.props.t('Show passphrase') :
            this.props.t('Hide passphrase')}
          icon={this.state.inputType === 'password' ? 'visibility' : 'visibility_off'}
          onClick={this.toggleInputType.bind(this)}/>
      </div>);
  }
}

export default translate()(PassphraseInput);
