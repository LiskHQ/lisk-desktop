import React from 'react';
import { parseSearchParams } from '../../../../../utils/searchParams';
import FormBtc from './formBtc';
import FormLsk from './formLsk';

const TagNameMap = {
  LSK: FormLsk,
  BTC: FormBtc,
};

export default function Form(props) {
  const { token, prevState, history } = props;

  const getInitialValue = (fieldName) => {
    const searchParams = parseSearchParams(history.location.search);
    return prevState && prevState.fields ? prevState.fields[fieldName].value : searchParams[fieldName] || '';
  };

  const TagName = TagNameMap[token];
  return <TagName {...props} key={token} getInitialValue={getInitialValue} />;
}

Form.defaultProps = {
  prevState: {},
};
