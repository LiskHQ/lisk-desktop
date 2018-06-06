import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { FontIcon } from '../fontIcon';
import Input from '../toolbox/inputs/input';
import { isValidPassphrase, getPassphraseValidationErrors } from '../../utils/passphrase';
import styles from './passphraseInput.css';
import keyCodes from './../../constants/keyCodes';

class PassphraseInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputType: 'password',
      isFocused: this.props.isFocused || false,
      partialPassphraseError: [],
      focus: 0,
    };
  }

  setFocusedField(field) {
    this.setState({ focus: field });
  }

  handleValueChange(index, value) {
    let insertedValue = value.trim().replace(/\W+/g, ' ');
    const insertedValueAsArray = insertedValue.split(' ');
    let passphrase = this.props.value.split(' ');

    if (insertedValueAsArray.length > 1) {
      for (let i = 0; i < 12; i++) {
        if (insertedValueAsArray[i]) {
          passphrase[i] = insertedValueAsArray[i];
          this.setState({ focus: i });
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
    }
    this.props.onChange(passphrase, error);
  }

  // eslint-disable-next-line class-methods-use-this
  getPassphraseValidationError(passphrase) {
    const { partialPassphraseError, validationError } = getPassphraseValidationErrors(passphrase);
    this.setState({ partialPassphraseError });

    return validationError;
  }

  toggleInputType() {
    this.setState({ inputType: this.state.inputType === 'password' ? 'text' : 'password' });
  }

  keyAction({ event, value, index }) {
    if (event.which === keyCodes.space || event.which === keyCodes.arrowRight) {
      event.preventDefault();
      this.setState({ focus: index + 1 });
    }

    if ((event.which === keyCodes.delete && !value) || event.which === keyCodes.arrowLeft) {
      this.setState({ focus: index - 1 });
    }
  }

  setFocused() {
    if (this.props.onFocus) this.props.onFocus();
    this.setState({ isFocused: true });
  }

  focusAndPaste(value) {
    this.setFocused();
    this.handleValueChange(0, value);
  }

  render() {
    const propsColumns = this.props.columns;
    const xs = `col-xs-${propsColumns && propsColumns.xs ? propsColumns.xs : '6'}`;
    const sm = `col-sm-${propsColumns && propsColumns.sm ? propsColumns.sm : '2'}`;
    const md = `col-md-${propsColumns && propsColumns.md ? propsColumns.md : '2'}`;

    const value = this.props.value.split(' ');
    return (
      <div onClick={this.setFocused.bind(this)}>
        {this.state.isFocused
          ?
          <div className={styles.wrapper}>
            <div
              className={`show-passphrase-toggle ${styles.inputTypeToggle}`}
              onClick={this.toggleInputType.bind(this)}>
              <FontIcon className={styles.eyeIcon} value={this.state.inputType === 'password' ? 'hide' : 'show'}
              /> <label>{this.state.inputType === 'password' ? this.props.t('Show passphrase') : this.props.t('Hide passphrase') }</label>
            </div>
            <div className={grid.row}>
              {[...Array(12)].map((x, i) =>
                <div className={`${grid[xs]} ${grid[sm]} ${grid[md]}`} key={i}>
                  <Input
                    shouldfocus={this.state.focus === i ? 1 : 0}
                    placeholder={i === 0 ? this.props.t('Start here') : ''}
                    className={`${this.props.className} ${styles.partial} ${this.state.partialPassphraseError[i] ? styles.error : ''}`}
                    value={value[i] || ''}
                    type={this.state.inputType}
                    theme={this.props.theme}
                    autoComplete='off'
                    onFocus={(e) => {
                      const val = e.target.value;
                      e.target.value = '';
                      e.target.value = val;

                      this.setFocusedField(i);
                    }}
                    onBlur={this.setFocusedField.bind(this, null)}
                    onChange={(val) => {
                      this.handleValueChange(i, val);
                    }}
                    onKeyDown={(event) => {
                      this.keyAction({ event, value: value[i], index: i });
                    }}
                    index={i}
                  />
                </div>)}
            </div>
            <div className={styles.errorMessage}>{this.props.error}</div>
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

export { PassphraseInput };
// eslint-disable-next-line import/no-named-as-default
export default translate()(PassphraseInput);
