import { translate } from 'react-i18next';
import React from 'react';
import Input from '../toolbox/inputs/input';
import styles from './passphrasePartial.css';

class PassphrasePartial extends React.Component {
  handleValueChange(value) {
    this.props.onChange(value);
  }

  render() {
    return (<Input
      shouldfocus={this.props.shouldfocus}
      placeholder={this.props.index === 0 ? 'start here' : ''}
      className={`${this.props.className} ${styles.partial} ${this.props.error ? styles.error : ''}`}
      value={this.props.partialValue}
      type={this.props.type}
      theme={this.props.theme}
      onFocus={typeof this.props.onFocus === 'function' ? this.props.onFocus : undefined}
      onBlur={typeof this.props.onBlur === 'function' ? this.props.onBlur : undefined}
      onChange={this.handleValueChange.bind(this)}
      onKeyDown={(event) => {
        this.props.keyAction({ event, value: this.props.partialValue, index: this.props.index });
      }}
    />);
  }
}

export default translate()(PassphrasePartial);
