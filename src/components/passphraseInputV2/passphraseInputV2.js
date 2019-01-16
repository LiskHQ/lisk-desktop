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
    };

    this.handleToggleShowPassphrase = this.handleToggleShowPassphrase.bind(this);
    this.setFocusedField = this.setFocusedField.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.keyAction = this.keyAction.bind(this);
  }

  keyAction(event) {
    let { focus } = this.state;
    const value = this.state.values[focus];
    if (event.which === keyCodes.space || event.which === keyCodes.arrowRight) {
      focus = focus < this.props.inputsLength - 1 ? focus + 1 : focus;
      event.preventDefault();
    }
    if ((event.which === keyCodes.delete && !value) || event.which === keyCodes.arrowLeft) {
      focus = focus <= 0 ? 0 : focus - 1;
    }
    this.setState({ focus });
  }

  // eslint-disable-next-line max-statements
  handleValueChange({ target }) {
    let { values, focus } = this.state;
    const index = target.dataset.index;
    const insertedValue = target.value.trim().replace(/\W+/g, ' ');
    const insertedValueAsArray = insertedValue.split(' ');

    values[index] = insertedValue;
    focus = index;

    if (insertedValueAsArray.length > 1) {
      values = insertedValueAsArray;
      focus = insertedValueAsArray.length - 1;
    }

    let errorState = { validationError: '', partialPassphraseError: [], passphraseIsInvalid: false };
    const passphrase = values.join(' ');
    if (!isValidPassphrase(passphrase)) {
      errorState = getPassphraseValidationErrors(passphrase);
      errorState.passphraseIsInvalid = errorState.validationError === this.props.t('Passphrase is not valid');
    }

    if (!passphrase.trim().length) {
      errorState = {
        ...errorState,
        passphraseIsInvalid: true,
        validationError: this.props.t('Required'),
      };
    }

    this.setState({
      values,
      focus,
      ...errorState,
    });

    this.props.onFill(passphrase, errorState.validationError);
  }

  setFocusedField(focus) {
    this.setState({ focus });
  }

  handleToggleShowPassphrase() {
    const showPassphrase = !this.state.showPassphrase;
    this.setState({ showPassphrase });
  }

  render() {
    const { t, inputsLength } = this.props;
    const { values } = this.state;

    return (
      <React.Fragment>
        <div className={`${styles.inputs} ${grid.row}`}>
          {[...Array(inputsLength)].map((x, i) => (
            <span key={i} className={`${grid['col-xs-2']}`}>
              <input
                ref={ref => ref !== null && this.state.focus === i && ref.focus() }
                placeholder={i + 1}
                className={`${this.state.partialPassphraseError[i] || this.state.passphraseIsInvalid ? 'error' : ''} ${this.state.focus === i ? 'selected' : ''}`}
                value={values[i] || ''}
                type={this.state.showPassphrase ? 'text' : 'password'}
                autoComplete='off'
                onFocus={() => this.setFocusedField(i)}
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
