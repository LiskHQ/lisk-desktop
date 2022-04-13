import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import loginTypes from '@wallet/configuration/loginTypes';
import { tokenMap } from '@token/configuration/tokens';
import { extractAddress as extractBitcoinAddress } from '@wallet/utilities/api';
import { getConnectionErrorMessage } from '@network/utilities/getNetwork';
import { extractKeyPair } from '@wallet/utilities/account';
import { defaultDerivationPath } from '@common/utilities/explicitBipKeyDerivation';
import actionTypes from '@wallet/store/actionTypes';
import { accountLoading, getAccounts, accountLoggedOut } from '@wallet/store/action';

const login = ({
  passphrase, publicKey, hwInfo,
}) =>
  async (dispatch, getState) => {
    const { network, settings } = getState();
    const { enableCustomDerivationPath, customDerivationPath } = settings;
    dispatch(accountLoading());

    const params = Object.keys(settings.token.list)
      .filter(key => settings.token.list[key])
      .reduce((acc, token) => {
        if (token === tokenMap.BTC.key) {
          acc[token] = {
            address: extractBitcoinAddress(passphrase, network),
          };
        } else {
          let keyPair = {};
          if (passphrase) {
            keyPair = extractKeyPair({
              passphrase,
              enableCustomDerivationPath,
              derivationPath: customDerivationPath || defaultDerivationPath,
            });
          } else if (publicKey) {
            keyPair.publicKey = publicKey;
          }
          acc[token] = {
            ...keyPair,
          };
        }
        return acc;
      }, {});

    const [error, info] = await to(getAccounts({ network, params }));

    if (error) {
      toast.error(getConnectionErrorMessage(error));
      dispatch(accountLoggedOut());
    } else {
      const loginType = hwInfo
        ? ['trezor', 'ledger'].find(item => hwInfo.deviceModel.toLowerCase().indexOf(item) > -1)
        : 'passphrase';
      dispatch({
        type: actionTypes.accountLoggedIn,
        data: {
          passphrase,
          loginType: loginTypes[loginType].code,
          hwInfo: hwInfo || {},
          date: new Date(),
          info,
        },
      });
    }
  };

export default { login, accountLoading };
