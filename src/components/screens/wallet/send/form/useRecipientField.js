import { useState } from 'react';

const useRecipientField = (initialValue) => {
  const [recipientField, setRecipientField] = useState({
    address: initialValue,
    value: initialValue,
    error: false,
    feedback: '',
    selected: false,
    title: '',
  });
  return [recipientField, setRecipientField];
};

export default useRecipientField;
