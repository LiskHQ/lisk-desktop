import regex from './regex';

const inputValidationRegexps = {
  recipient: regex.address,
  amount: regex.amount,
};

const validateInput = (translate, name, value, required) => {
  const byteCount = encodeURI(value).split(/%..|./).length - 1;

  if ((!value || value === '0') && required) return translate('Required');
  if (name === 'reference' && byteCount > 64) return translate('Maximum length exceeded');
  if (!value.match(inputValidationRegexps[name])) return translate('Invalid amount');
  return undefined;
};

export default {
  validateInput,
};
