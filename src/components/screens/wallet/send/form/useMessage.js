import { useState } from 'react';
import { sizeOfString } from '../../../../../utils/helpers';
import i18n from '../../../../../i18n';

const useMessage = (initialValue, messageMaxLength) => {
  const [messageField, setMessage] = useState({
    error: false,
    value: initialValue,
    feedback: i18n.t('64 bytes left'),
    byteCount: sizeOfString(initialValue),
  });

  const onMessageInputChange = ({ target: { value } }) => {
    const byteCount = sizeOfString(value);
    setMessage({
      byteCount,
      error: byteCount > messageMaxLength,
      value,
      feedback: i18n.t('{{length}} bytes left', { length: messageMaxLength - byteCount }),
    });
  };

  return [messageField, onMessageInputChange];
};

export default useMessage;
