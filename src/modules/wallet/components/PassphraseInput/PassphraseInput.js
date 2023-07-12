import React from 'react';
import { withTranslation } from 'react-i18next';
import { keyCodes } from 'src/utils/keyCodes';
import { passphrase as LiskPassphrase } from '@liskhq/lisk-client';
import Icon from 'src/theme/Icon';
import Input from 'src/theme/Input';
import Feedback from 'src/theme/feedback/feedback';
import styles from './PassphraseInput.css';

class passphraseInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassphrase: false,
      partialPassphraseError: [],
      values: props.values || [],
      focus: 0,
      validationError: '',
      passphraseIsInvalid: false,
      inputsLength: props.inputsLength,
    };

    this.handleToggleShowPassphrase = this.handleToggleShowPassphrase.bind(this);
    this.setFocusedField = this.setFocusedField.bind(this);
    this.removeFocusedField = this.removeFocusedField.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.keyAction = this.keyAction.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  keyAction(event) {
    let { focus, inputsLength } = this.state;
    const index = parseInt(event.target.dataset.index, 10);
    if (
      event.which === keyCodes.space ||
      event.which === keyCodes.arrowRight ||
      event.which === keyCodes.tab
    ) {
      inputsLength = index + 1 > inputsLength - 1 ? this.props.maxInputsLength : inputsLength;
      focus = index + 1 > inputsLength - 1 ? index : index + 1;
      event.preventDefault();
    }
    if (
      (event.which === keyCodes.delete && !this.state.values[focus]) ||
      event.which === keyCodes.arrowLeft
    ) {
      focus = index - 1 < 0 ? index : index - 1;
      event.preventDefault();
    }
    this.setState({ focus, inputsLength });
  }

  handlePaste({ clipboardData, target }) {
    let { values, inputsLength } = this.state;
    const index = parseInt(target.dataset.index, 10);
    const pastedValue = clipboardData.getData('Text').trim().replace(/\W+/g, ' ').split(/\s/);
    if (pastedValue.length <= 1) {
      values[index] = '';
    } else {
      const insertedValue = [...Array(index), ...pastedValue];
      inputsLength =
        insertedValue.length > inputsLength ? this.props.maxInputsLength : inputsLength;
      values = insertedValue.map((value, key) => value || values[key]).splice(0, inputsLength);
    }

    this.validatePassphrase({ values, inputsLength });
  }

  handleValueChange({ target }) {
    const { values } = this.state;
    const index = parseInt(target.dataset.index, 10);
    const insertedValue = target.value.trim().replace(/\W+/g, ' ');
    if (insertedValue.split(/\s/).length > 1) return;

    values[index] = insertedValue;
    this.validatePassphrase({ values, focus: index });
  }

  // eslint-disable-next-line max-statements
  validatePassphrase({ values, inputsLength = this.state.inputsLength, focus = 0 }) {
    let errorState = {
      validationError: '',
      partialPassphraseError: [],
      passphraseIsInvalid: false,
    };

    const passphrase = values.join(' ').trim();
    if (!LiskPassphrase.Mnemonic.validateMnemonic(passphrase)) {
      const validationErrors = LiskPassphrase.validation.getPassphraseValidationErrors(
        passphrase,
        LiskPassphrase.Mnemonic.wordlists.english,
        inputsLength
      );
      errorState.passphraseIsInvalid = true;
      if (validationErrors[0].code === 'INVALID_AMOUNT_OF_WORDS') {
        errorState.validationError = this.props.t(
          `Passphrase contains ${
            values.filter((p) => p.trim() !== '').length
          } words instead of expected ${inputsLength}. Please check the passphrase.`
        );
      } else {
        errorState.validationError = this.props.t(validationErrors[0].message);
      }
    }

    if (!passphrase.length) {
      errorState = {
        ...errorState,
        passphraseIsInvalid: true,
        validationError: this.props.t('Required'),
      };
    }

    this.setState({
      values,
      inputsLength,
      focus,
      ...errorState,
    });

    this.props.onFill(passphrase, errorState.validationError);
  }

  removeFocusedField() {
    this.setState({ focus: null });
  }

  setFocusedField({ target }) {
    const focus = parseInt(target.dataset.index, 10);
    const value = target.value;
    target.value = '';
    target.value = value;
    this.setState({ focus });
  }

  handleToggleShowPassphrase() {
    this.setState(({ showPassphrase }) => ({
      showPassphrase: !showPassphrase,
    }));
  }

  render() {
    const { t, keyPress } = this.props;
    const {
      focus,
      inputsLength,
      partialPassphraseError,
      passphraseIsInvalid,
      showPassphrase,
      validationError: isFeedbackOnError,
      values,
    } = this.state;
    const iconName = showPassphrase ? 'showPassphraseIcon' : 'hidePassphraseIcon';

    return (
      <>
        <div className={styles.wrapper}>
          <label className={`${styles.showPassphrase}`} onClick={this.handleToggleShowPassphrase}>
            <Icon name={iconName} />
            <span className={`${styles.label}`}>{showPassphrase ? t('Hide') : t('Show')}</span>
          </label>

          <div
            className={[
              styles.inputs,
              partialPassphraseError.length ? styles.boxOnError : '',
              'passphrase',
            ].join(' ')}
          >
            {[...Array(inputsLength)].map((x, i) => (
              <span key={i} className={styles.inputContainer} autoComplete="off">
                <span
                  className={[
                    styles.inputNumber,
                    partialPassphraseError[i] ? styles.inputNumberError : '',
                  ].join(' ')}
                >
                  {`${i + 1}. `}
                </span>
                <Input
                  name={`recovery-${i}`}
                  setRef={(ref) =>
                    ref !== null &&
                    this.state.focus === i &&
                    ref !== document.activeElement &&
                    ref.focus()
                  }
                  placeholder="_________"
                  className={[
                    partialPassphraseError[i] || passphraseIsInvalid ? 'error' : '',
                    focus === i ? 'selected' : '',
                  ].join(' ')}
                  value={values[i] || ''}
                  type={this.state.showPassphrase ? 'text' : 'password'}
                  autoComplete="off"
                  onBlur={this.removeFocusedField}
                  onFocus={this.setFocusedField}
                  onPaste={this.handlePaste}
                  onChange={this.handleValueChange}
                  onKeyDown={this.keyAction}
                  onKeyPress={keyPress}
                  data-index={i}
                />
              </span>
            ))}
          </div>

          <div className={styles.footerContent}>
            <Feedback
              className={styles.errorMessage}
              status={isFeedbackOnError ? 'error' : 'ok'}
              message={isFeedbackOnError}
            />
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(passphraseInput);
