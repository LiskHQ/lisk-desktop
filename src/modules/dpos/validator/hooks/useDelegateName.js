import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { regex } from 'src/const/regex';
import { useDelegates } from './queries';

const validate = (query, t) => {
  if (query.length === 0) {
    return t('Username can not be empty.');
  }
  if (query.length < 3) {
    return t('Username is too short.');
  }
  if (query.length > 20) {
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
    options: { enabled: name.value?.length >= 3, retry: false },
  });

  const checkUsername = async () => {
    if (name.value.length >= 3 && name.value.length <= 20 && isLoading) {
      setName({
        ...name,
        loading: true,
      });
    }
    if (name.value.length >= 3 && !isLoading) {
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
      }, 500);
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
