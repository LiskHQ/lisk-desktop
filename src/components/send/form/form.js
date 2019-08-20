import React from 'react';
import FormBtc from './formBtc';
import FormLsk from './formLsk';

const TagNameMap = {
  LSK: FormLsk,
  BTC: FormBtc,
};

export default function Form(props) {
  const { token } = props;
  const TagName = TagNameMap[token];
  return <TagName {...props} key={token} />;
}
