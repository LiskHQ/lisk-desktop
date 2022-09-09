import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { extractPublicKey } from '@wallet/utils/account';

const empty2ndPass = {
  data: '',
  error: -1,
  feedback: [],
};

const setSecondPassphrase = () => {
  const [secondPass, set2ndPass] = useState(empty2ndPass);
  const account = useSelector(selectActiveTokenAccount);

  const validate2ndPass = (data, error) => {
    const messages = [];
    if (error) {
      messages.push(messages);
      return messages;
    }

    const secondPublicKey = account.keys.mandatoryKeys.filter(
      (item) => item !== account.summary.publicKey
    );
    const publicKey = extractPublicKey(data);

    // compare them
    if (!secondPublicKey.length || publicKey !== secondPublicKey[0]) {
      messages.push('This passphrase does not belong to your account.');
    }
    return messages;
  };

  const setter = (data, error) => {
    const feedback = validate2ndPass(data, error);
    set2ndPass({
      data,
      error: data === '' ? -1 : feedback.length,
      feedback,
    });
  };

  return [secondPass, setter];
};

export default setSecondPassphrase;
