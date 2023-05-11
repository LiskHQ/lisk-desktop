import { useSelector } from 'react-redux';
import { selectSettings } from 'src/redux/selectors';
import { encryptAccount as encryptAccountUtils } from '@account/utils';

// eslint-disable-next-line
export function useEncryptAccount(customDerivationPath) {
  const { enableAccessToLegacyAccounts } = useSelector(selectSettings);
  const encryptAccount = ({ recoveryPhrase, password, name }) =>
    encryptAccountUtils({
      recoveryPhrase,
      password,
      name,
      enableAccessToLegacyAccounts,
      derivationPath: customDerivationPath,
    });
  return { encryptAccount };
}
