import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { regex } from 'src/const/regex';
import { DELEGATE_NAME_LENGTH } from '../consts';
import { useDelegates } from './queries';

const validate = (query, t) => {
  if (query.length === 0) {
    return t('Username can not be empty.');
  }
  if (query.length < DELEGATE_NAME_LENGTH.Minimum) {
    return t('Username is too short.');
  }
  if (query.length > DELEGATE_NAME_LENGTH.Maximum) {
    return t('Username is too long.');
  }
  const hasInvalidChars = query.replace(regex.delegateSpecialChars, '');
  if (hasInvalidChars) {
    return t(`Invalid character ${hasInvalidChars.trim()}`);
  }
  return '';
};

const useDelegateName = (value) => {
  const [name, setName] = useState({
    value: value ?? '',
    loading: false,
    error: false,
    message: '',
  });
  const timeout = useRef();
  const { t } = useTranslation();
  const [params, setParams] = useState({});
  const { data, isLoading, error } = useDelegates({
    config: { params },
    options: { enabled: name.value?.length >= DELEGATE_NAME_LENGTH.Minimum, retry: false },
  });

  const checkUsername = async () => {
    if (
      name.value.length >= DELEGATE_NAME_LENGTH.Minimum &&
      name.value.length <= DELEGATE_NAME_LENGTH.Maximum &&
      isLoading
    ) {
      setName({
        ...name,
        loading: true,
      });
    }
    if (name.value.length >= DELEGATE_NAME_LENGTH.Minimum && !isLoading) {
      if (error) {
        setName({
          ...name,
          error: false,
          loading: false,
        });
      } else {
        setName({
          ...name,
          loading: false,
          error: true,
          message: t('"{{username}}" is already taken.', { username: name.value }),
        });
      }
    }
  };

  useEffect(() => {
    clearTimeout(timeout.current);
    const formatError = validate(name.value, t);
    if (!formatError) {
      timeout.current = setTimeout(() => {
        setParams({ name: name.value });
      }, 1000);
    } else {
      setName({
        ...name,
        error: true,
        message: formatError,
      });
    }
  }, [name.value]);

  useEffect(() => {
    checkUsername();
  }, [data, isLoading, error]);

  return [name, setName];
};

export default useDelegateName;
