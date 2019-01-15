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
      error: '',
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
      focus++;
      event.preventDefault();
    }
    if ((event.which === keyCodes.delete && !value) || event.which === keyCodes.arrowLeft) {
      focus--;
    }
    this.setState({ focus });
  }

  // eslint-disable-next-line max-statements
  handleValueChange(index, value) {
    let { values, focus } = this.state;
    const insertedValue = value.trim().replace(/\W+/g, ' ');
    const insertedValueAsArray = insertedValue.split(' ');

    values[index] = insertedValue;
    focus = index;

    if (insertedValueAsArray.length > 1) {
      values = insertedValueAsArray;
      focus = insertedValueAsArray.length - 1;
    }

    let errorState = { error: '', partialPassphraseError: [] };
    const passphrase = values.join(' ');
    if (!isValidPassphrase(passphrase)) {
      const { partialPassphraseError, validationError } = getPassphraseValidationErrors(passphrase);
      errorState = {
        partialPassphraseError,
        error: validationError,
      };
    }

    this.setState({
      values,
      focus,
      ...errorState,
    });
  }

  setFocusedField({ field = null }) {
    this.setState({ focus: field });
  }

  handleToggleShowPassphrase() {
    const showPassphrase = !this.state.showPassphrase;
    this.setState({ showPassphrase });
  }

  render() {
    const { t } = this.props;
    const { values } = this.state;

    return (
      <React.Fragment>
        <div className={`${styles.inputs} ${grid.row}`}>
          {[...Array(12)].map((x, i) => (
            <span key={i} className={`${grid['col-xs-2']}`}>
              <input
                ref={ref => ref !== null && this.state.focus === i && ref.focus() }
                placeholder={i + 1}
                className={`${this.state.partialPassphraseError[i] ? styles.error : ''}`}
                value={values[i] || ''}
                type={this.state.showPassphrase ? 'text' : 'password'}
                autoComplete='off'
                onFocus={(e) => {
                  const val = e.target.value;
                  e.target.value = '';
                  e.target.value = val;

                  this.setFocusedField({ field: i });
                }}
                onBlur={this.setFocusedField}
                onChange={e => this.handleValueChange(i, e.target.value)}
                onKeyDown={this.keyAction}
                index={i}
              />
            </span>
          ))}
        </div>

        <span className={`${styles.errorMessage}`}>
          { this.state.error }
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
