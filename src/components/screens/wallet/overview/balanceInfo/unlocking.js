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

const Link = ({
  sum, style, icon, isWalletRoute,
}) => (
  <div className={`${styles.lockedBalance} ${style}`}>
    <Icon name={icon || 'lock'} />
    {`${fromRawLsk(sum)} ${tokenMap.LSK.key}`}
    {isWalletRoute && (
    <DialogLink
      className={`${styles.pointer} ${styles.lockedIcon} open-unlock-balance-dialog`}
      component="lockedBalance"
    >
      <Icon name="arrowRightCircle" />
    </DialogLink>
    )}
  </div>
);

// eslint-disable-next-line max-statements
const LockedBalanceLink = ({
  activeToken, account, isWalletRoute, style, icon,
}) => {
  const host = useSelector(state => getActiveTokenAccount(state));
  let lockedInVotes = 0;
  let lockedInUnvotes = 0;

  if (isWalletRoute && host) {
    lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  } else {
    lockedInVotes = calculateBalanceLockedInUnvotes(account.dpos?.sentVotes);
  }

  lockedInUnvotes = isWalletRoute && host
    ? (calculateBalanceLockedInUnvotes(host.dpos?.unlocking))
    : (
      calculateBalanceLockedInUnvotes(account.dpos?.unlocking)
    );

  if (lockedInUnvotes + lockedInVotes > 0) {
    return (
      <Link
        sum={lockedInUnvotes + lockedInVotes}
        style={style}
        icon={icon}
        isWalletRoute={isWalletRoute}
      />
    );
  }
  return null;
};

export default LockedBalanceLink;
