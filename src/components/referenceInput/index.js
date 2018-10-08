import React from 'react';
// import Input from '../toolbox/inputs/input';
import Input from 'react-toolbox/lib/input';
import styles from './index.css';

class ReferenceInput extends React.Component {
  render() {
    const { handleChange, address, label, context } = this.props; // eslint-disable-line
    return (
      <Input
        innerRef={(ref) => { context.referenceInput = ref; }}
        className={`${styles.input} reference`}
        label={label}
        error={address.error}
        value={address.value}
        onChange={val => handleChange(val)} />
    );
  }
}

export default ReferenceInput;

