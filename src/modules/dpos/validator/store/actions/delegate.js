/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { tokenMap } from '@token/configuration/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { toRawLsk } from '@token/utilities/lsk';
import { isEmpty } from '@common/utilities/helpers';
import { create } from '@transaction/api';
import actionTypes from './actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const delegateRegistered = ({ fee, username }) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = {
    ...state.wallet.info.LSK,
    hwInfo: isEmpty(state.wallet.hwInfo) ? undefined : state.wallet.hwInfo,
    passphrase: state.wallet.passphrase,
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        senderPublicKey: activeWallet.summary.publicKey,
        nonce: activeWallet.sequence?.nonce,
        fee: toRawLsk(parseFloat(fee.value)),
        username,
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.registerDelegate,
      },
    }, tokenMap.LSK.key),
  );

  //
  // Dispatch corresponding action
  //
  if (!error) {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data: tx,
    });
  } else {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
};
