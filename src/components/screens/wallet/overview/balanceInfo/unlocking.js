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

const LockedBalanceLink = ({
  activeToken, isWalletRoute, style, icon,
}) => {
  const host = useSelector(state => getActiveTokenAccount(state));
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const lockedInUnvotes = activeToken === tokenMap.LSK.key && isWalletRoute && host
    ? calculateBalanceLockedInUnvotes(host.dpos?.unlocking) : 0;

  if (lockedInUnvotes + lockedInVotes > 0) {
    return (
      <Link sum={lockedInUnvotes + lockedInVotes} style={style} icon={icon} />
    );
  }
  return null;
};

export default LockedBalanceLink;
