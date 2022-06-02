import { transactionToJSON } from '@transaction/utils';

// eslint-disable-next-line no-unused-vars
export default (recoveryPhrase, password) => {
  // TODO implement this function in ticket #4299
  let JSONSchema = {
    name: 'encrypted recovery phrase',
    phrase: 'target cancel solution recipe vague faint bomb convince pink vendor fresh patrol',
  };
  JSONSchema = transactionToJSON(JSONSchema);
  return JSONSchema;
};
