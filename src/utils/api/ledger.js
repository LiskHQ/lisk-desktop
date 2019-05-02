import to from 'await-to-js';
import {
  getAccountFromLedgerIndex,
} from '../ledger';
import { getAccount } from './lsk/account';

const getLedgerAccountInfo = async (liskAPIClient, accountIndex) => {
  let error;
  let liskAccount;
  // eslint-disable-next-line
  [error, liskAccount] = await to(getAccountFromLedgerIndex(accountIndex));
  if (error) {
    throw error;
  }
  const resAccount = await getAccount(liskAPIClient, liskAccount.address);
  const isInitialized = !!resAccount.unconfirmedBalance;
  Object.assign(resAccount, { isInitialized });
  // Set PublicKey from Ledger Info
  // so we can switch on this account even if publicKey is not revealed to the network
  Object.assign(resAccount, { publicKey: liskAccount.publicKey });

  return resAccount;
};

export default getLedgerAccountInfo;
