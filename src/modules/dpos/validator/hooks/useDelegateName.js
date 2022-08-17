import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getDelegate } from '@dpos/validator/api';
import { regex } from 'src/const/regex';

const validate = (query, t) => {
  if (query.length === 0) {
    return t('Username can not be empty.');
  }
  if (query.length < 2) {
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
  const network = useSelector(state => state.network);

  const checkUsername = () => {
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setName({
        ...name,
        loading: true,
      });
      getDelegate({ network, params: { username: name.value } })
        .then(() => {
          setName({
            ...name,
            loading: false,
            error: true,
            message: t('"{{username}}" is already taken.', { username: name.value }),
          });
        })
        .catch(() => {
          setName({
            ...name,
            error: false,
            loading: false,
          });
        });
    }, 1000);
  };

  useEffect(() => {
    const formatError = validate(name.value, t);
    if (!formatError) {
      checkUsername();
    } else {
      setName({
        ...name,
        error: true,
        message: formatError,
      });
    }
  }, [name.value]);

  return [name, setName];
};

export default useDelegateName;
