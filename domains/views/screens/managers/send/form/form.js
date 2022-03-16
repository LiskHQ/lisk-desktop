import React from 'react';
import FormBtc from './formBtc';
import FormLsk from './formLsk';

const TokenSpecificFormMap = {
  LSK: FormLsk,
  BTC: FormBtc,
};

export default function Form(props) {
  const { token, prevState, initialValue } = props;

  const getInitialValue = fieldName => (
    prevState && prevState.fields ? prevState.fields[fieldName].value : initialValue[fieldName] || ''
  );

  const TokenSpecificForm = TokenSpecificFormMap[token];
  return <TokenSpecificForm {...props} key={token} getInitialValue={getInitialValue} />;
}

Form.defaultProps = {
  prevState: {},
  data: {},
};
