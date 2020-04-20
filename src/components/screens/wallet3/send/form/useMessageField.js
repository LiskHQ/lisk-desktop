import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { messageMaxLength } from '../../../../../constants/transactions';
import { sizeOfString } from '../../../../../utils/helpers';

const useMessageField = (initialValue) => {
  const { t } = useTranslation();
  const [messageField, setMessage] = useState({
    error: false,
    value: initialValue,
    feedback: t('64 bytes left'),
    byteCount: sizeOfString(initialValue),
  });

  const onMessageInputChange = ({ target: { value } }) => {
    const byteCount = sizeOfString(value);
    setMessage({
      byteCount,
      error: byteCount > messageMaxLength,
      value,
      feedback: t('{{length}} bytes left', { length: messageMaxLength - byteCount }),
    });
  };

  return [messageField, onMessageInputChange];
};

export default useMessageField;
