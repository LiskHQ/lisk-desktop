import { useSelector } from 'react-redux';
import { selectSettings } from '@common/store';
import { encryptAccount as encryptAccountUtils } from '@account/utils';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';

// eslint-disable-next-line
export function useEncryptAccount() {
  const { enableCustomDerivationPath, customDerivationPath } = useSelector(selectSettings);
  const derivationPath = enableCustomDerivationPath ? customDerivationPath : defaultDerivationPath;
  const encryptAccount = ({ recoveryPhrase, password, name }) => encryptAccountUtils({
    recoveryPhrase,
    password,
    name,
    derivationPath,
  });
  return { encryptAccount };
}
