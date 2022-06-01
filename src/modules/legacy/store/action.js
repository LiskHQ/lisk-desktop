import { to } from 'await-to-js';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { isEmpty } from 'src/utils/helpers';
import { create } from '@transaction/api';
import actionTypes from '@transaction/store/actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const balanceReclaimed = ({ fee }) => async (dispatch, getState) => {
  //
  // Collect data
  //
  const state = getState();
  const activeWallet = {
    ...state.wallet.info.LSK,
    ...!isEmpty(state.wallet.hwInfo) && { hwInfo: state.wallet.hwInfo },
    ...state.wallet.passphrase && { passphrase: state.wallet.passphrase },
  };

  //
  // Create the transaction
  //
  const [error, tx] = await to(
    create({
      network: state.network,
      wallet: activeWallet,
      transactionObject: {
        moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.reclaimLSK,
        fee: toRawLsk(fee.value),
        amount: activeWallet.legacy.balance,
        keys: { numberOfSignatures: 0 },
      },
    }),
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
