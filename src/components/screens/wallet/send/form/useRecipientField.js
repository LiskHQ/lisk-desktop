import { useState } from 'react';

const useRecipientField = (initialValue) => {
  const [recipientField, setRecipientField] = useState({
    required: true,
    address: initialValue,
    value: initialValue,
    error: false,
    feedback: '',
    selected: false,
    title: '',
  });

  const handleRecipientChange = (newValues) => {
    setRecipientField({
      ...recipientField,
      ...newValues,
    });
  };
  return [recipientField, handleRecipientChange];
};

export default useRecipientField;
