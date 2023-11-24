import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maxMessageLength } from '@transaction/configuration/transactions';
import { sizeOfString } from 'src/utils/helpers';

const getBytesLeftMessage = (value, t) => {
  const byteCount = sizeOfString(value);
  return t('{{length}} bytes left', { length: maxMessageLength - byteCount });
};

const useMessageField = (initialValue) => {
  const { t } = useTranslation();
  const [messageField, setMessage] = useState({
    error: false,
    value: initialValue,
    feedback: getBytesLeftMessage(initialValue, t),
    byteCount: sizeOfString(initialValue),
  });

  const onMessageInputChange = ({ target: { value } }) => {
    const byteCount = sizeOfString(value);
    setMessage({
      byteCount,
      value,
      error: byteCount > maxMessageLength,
      feedback: getBytesLeftMessage(value, t),
    });
  };

  return [messageField, onMessageInputChange];
};

export default useMessageField;
