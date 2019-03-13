import React from 'react';
import Input from 'react-toolbox/lib/input';
import styles from './index.css';

class ReferenceInput extends React.Component {
  render() {
    const { handleChange, reference, label, context } = this.props; // eslint-disable-line
    return (
      <Input
        className="reference"
        innerRef={(ref) => {
          // istanbul ignore next
          if (context) {
            context.referenceInput = ref;
          }
        }}
        theme={styles}
        label={label}
        error={reference.error}
        value={reference.value}
        onChange={val => handleChange(val)} />
    );
  }
}

export default ReferenceInput;

