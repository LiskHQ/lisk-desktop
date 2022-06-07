import React from 'react';
import FormLsk from './formLsk';

export default function Form(props) {
  const { token, prevState, initialValue } = props;

  const getInitialValue = fieldName => (
    prevState && prevState.fields ? prevState.fields[fieldName].value : initialValue[fieldName] || ''
  );

  return <FormLsk {...props} key={token} getInitialValue={getInitialValue} />;
}

Form.defaultProps = {
  prevState: {},
  data: {},
};
