import React from 'react';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import { isValidPassphrase, getPassphraseValidationErrors } from '../../utils/passphrase';
import keyCodes from './../../constants/keyCodes';
import styles from './passphraseInputV2.css';

class passphraseInputV2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassphrase: false,
      partialPassphraseError: [],
      values: [],
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
    if (event.which === keyCodes.space || event.which === keyCodes.arrowRight) {
      inputsLength = index + 1 > inputsLength - 1 ? this.props.maxInputsLength : inputsLength;
      focus = index + 1 > inputsLength - 1 ? index : index + 1;
      event.preventDefault();
    }
    if ((event.which === keyCodes.delete && !this.state.values[focus])
      || event.which === keyCodes.arrowLeft) {
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
      const insertedValue = [
        ...Array(index),
        ...pastedValue,
      ];
      inputsLength = insertedValue.length > inputsLength
        ? this.props.maxInputsLength : inputsLength;
      values = insertedValue
        .map((value, key) => value || values[key])
        .splice(0, inputsLength);
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

  validatePassphrase({ values, inputsLength = this.state.inputsLength, focus = null }) {
    let errorState = { validationError: '', partialPassphraseError: [], passphraseIsInvalid: false };
    const passphrase = values.join(' ').trim();
    if (!isValidPassphrase(passphrase)) {
      errorState = getPassphraseValidationErrors(passphrase);
      errorState.passphraseIsInvalid =
        errorState.validationError === this.props.t('Passphrase is not valid');
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
    this.setState({ focus });
  }

  handleToggleShowPassphrase() {
    const showPassphrase = !this.state.showPassphrase;
    this.setState({ showPassphrase });
  }

  render() {
    const { t } = this.props;
    const { values, inputsLength } = this.state;

    return (
      <React.Fragment>
        <div className={`${styles.inputs} ${grid.row} passphrase`}>
          {[...Array(inputsLength)].map((x, i) => (
            <span key={i} className={`${grid['col-xs-2']}`}>
              <input
                ref={ref => ref !== null && this.state.focus === i && ref.focus() }
                placeholder={this.state.focus === i ? '' : i + 1 }
                className={`${this.state.partialPassphraseError[i] || this.state.passphraseIsInvalid ? 'error' : ''} ${this.state.focus === i ? 'selected' : ''}`}
                value={values[i] || ''}
                type={this.state.showPassphrase ? 'text' : 'password'}
                autoComplete='off'
                onBlur={this.removeFocusedField}
                onFocus={this.setFocusedField}
                onPaste={this.handlePaste}
                onChange={this.handleValueChange}
                onKeyDown={this.keyAction}
                data-index={i}
              />
            </span>
          ))}
        </div>

        <span className={`${styles.errorMessage} ${this.state.validationError ? styles.showError : ''}`}>
          { this.state.validationError }
        </span>

        <label className={`${styles.showPassphrase}`}>
          <input checked={this.state.showPassphrase}
            type='checkbox' onChange={this.handleToggleShowPassphrase}/>
          <span className={`${styles.fakeCheckbox}`}>
            <FontIcon className={`${styles.icon}`}>checkmark</FontIcon>
          </span>
          <span className={`${styles.label}`}>{t('Show passphrase')}</span>
        </label>
      </React.Fragment>
    );
  }
}

export default translate()(passphraseInputV2);
