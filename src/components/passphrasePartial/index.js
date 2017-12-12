import { translate } from 'react-i18next';
import React from 'react';
import Input from '../toolbox/inputs/input';
import styles from './passphrasePartial.css';

class PassphraseInput extends React.Component {
  constructor() {
    super();
    this.input = [];
    this.state = {
      inputType: 'password',
    };
  }

  handleValueChange(value) {
    this.props.onChange(value, this.props.index);
  }

  render() {
    return (<Input
      placeholder={this.props.index === 0 ? 'start here' : ''}
      className={`${this.props.className} ${styles.partial} ${this.props.error ? styles.error : ''}`}
      value={this.props.partialValue}
      type={this.props.type}
      theme={this.props.theme}
      onFocus={this.props.index === 0 && typeof this.props.onFocus === 'function' ? this.props.onFocus : undefined}
      onChange={this.handleValueChange.bind(this)}
      onKeyPress={(event) => { this.props.doNext({ event, index: this.props.index }); }}
      onKeyDown={(event) => { this.props.doDelete({ event, index: this.props.index }); }}
    />);
  }
}

export default translate()(PassphraseInput);
