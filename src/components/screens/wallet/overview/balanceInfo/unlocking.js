import React from 'react';
import { useSelector } from 'react-redux';

import { tokenMap } from '@constants';
import { fromRawLsk } from '@utils/lsk';
import DialogLink from '@toolbox/dialog/link';
import {
  calculateBalanceLockedInUnvotes,
  calculateBalanceLockedInVotes,
  getActiveTokenAccount,
} from '@utils/account';
import Icon from '@toolbox/icon';
import styles from './balanceInfo.css';

const Link = ({ sum, style, icon }) => (
  <DialogLink
    className={`${styles.lockedBalance} ${styles.pointer} ${style} open-unlock-balance-dialog`}
    component="lockedBalance"
  >
    <Icon name={icon || 'lock'} />
    {`${fromRawLsk(sum)} ${tokenMap.LSK.key}`}
  </DialogLink>
);

// eslint-disable-next-line max-statements
const LockedBalanceLink = ({
  activeToken, account, isWalletRoute, style, icon,
}) => {
  const host = useSelector(state => getActiveTokenAccount(state));
  let lockedInVotes = 0;
  let lockedInUnvotes = 0;

  // Calculate locked-in votes for self or other delegates.
  if (isWalletRoute && host) {
    lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  } else {
    lockedInVotes = calculateBalanceLockedInUnvotes(account.dpos?.sentVotes);
  }

  // Calculate locked-in unvotes for self or other delegates.
  if (activeToken === tokenMap.LSK.key) {
    if (isWalletRoute && host) {
      lockedInUnvotes = calculateBalanceLockedInUnvotes(host.dpos?.unlocking);
    } else {
      lockedInUnvotes = calculateBalanceLockedInUnvotes(account.dpos?.unlocking);
    }
  }

  if (lockedInUnvotes + lockedInVotes > 0) {
    return (
      <Link sum={lockedInUnvotes + lockedInVotes} style={style} icon={icon} />
    );
  }
  return null;
};

export default LockedBalanceLink;
