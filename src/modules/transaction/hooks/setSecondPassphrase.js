import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import { validate2ndPass } from '@wallet/utils/account';

const empty2ndPass = {
  passphrase: '',
  error: -1,
  feedback: [],
};

const setSecondPassphrase = () => {
  const [secondPass, set2ndPass] = useState(empty2ndPass);
  const account = useSelector(selectActiveTokenAccount);

  const setter = useCallback(
    (data, error) => {
      validate2ndPass(account, data, error).then((feedback) => {
        set2ndPass({
          data,
          error: data === '' ? -1 : feedback.length,
          feedback,
        });
      });
    },
    [set2ndPass]
  );

  return [secondPass, setter];
};

export default setSecondPassphrase;
