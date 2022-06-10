import { useSelector } from 'react-redux';
import { selectSettings } from '@common/store';
import { encryptAccount as encryptAccountUtils } from '@account/utils';

// eslint-disable-next-line
export function useEncryptAccount() {
  const { enableCustomDerivationPath, customDerivationPath } = useSelector(selectSettings);
  const encryptAccount = ({ recoveryPhrase, password, name }) => encryptAccountUtils({
    recoveryPhrase,
    password,
    name,
    enableCustomDerivationPath,
    derivationPath: customDerivationPath,
  });
  return { encryptAccount };
}
