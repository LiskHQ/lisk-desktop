import { useSelector } from 'react-redux';
import { selectSettings } from 'src/redux/selectors';
import { encryptAccount as encryptAccountUtils } from '@account/utils';

// eslint-disable-next-line
export function useEncryptAccount() {
  const { enableCustomDerivationPath, customDerivationPath } = useSelector(selectSettings);
  const encryptAccount = ({ recoveryPhrase, password, name }) =>
    encryptAccountUtils({
      recoveryPhrase,
      password,
      name,
      enableCustomDerivationPath,
      derivationPath: customDerivationPath,
    });
  return { encryptAccount };
}
