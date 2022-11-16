import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { regex } from 'src/const/regex';
import { DELEGATE_NAME_LENGTH } from '../consts';
import { useDelegates } from './queries';

// eslint-disable-next-line max-statements
const getErrorMessage = (name, data, t) => {
  if (name.length === 0) {
    return t('Username can not be empty.');
  }
  if (name.length < DELEGATE_NAME_LENGTH.Minimum) {
    return t('Username is too short.');
  }
  if (name.length > DELEGATE_NAME_LENGTH.Maximum) {
    return t('Username is too long.');
  }
  const hasInvalidChars = name.replace(regex.delegateSpecialChars, '');
  if (hasInvalidChars) {
    return t(`Invalid character ${hasInvalidChars.trim()}`);
  }
  if (data?.data) {
    return t('"{{username}}" is already taken.', { username: name });
  }
  return '';
};

const useDelegateName = (value) => {
  const [name, setName] = useState(value ?? '');
  const [nameDebounced, setNameDebounced] = useState(value ?? '');
  const { t } = useTranslation();

  const { data, isLoading } = useDelegates({
    config: { params: { name: nameDebounced } },
    options: { enabled: nameDebounced?.length >= DELEGATE_NAME_LENGTH.Minimum, retry: false },
  });

  const errorMessage = getErrorMessage(name, data, t);

  const setNameDebounce = useCallback(debounce(setNameDebounced, 1000), []);

  useEffect(() => {
    if (!getErrorMessage(name, null, t)) {
      setNameDebounce(name);
    }
  }, [name]);

  return [
    {
      value: name,
      loading: isLoading,
      error: !!errorMessage,
      message: errorMessage,
    },
    setName,
  ];
};

export default useDelegateName;
