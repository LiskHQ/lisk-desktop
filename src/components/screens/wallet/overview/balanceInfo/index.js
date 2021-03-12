import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { tokenMap } from 'constants';
import { PrimaryButton, SecondaryButton } from '../../../../toolbox/buttons';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import LiskAmount from '../../../../shared/liskAmount';
import DiscreetMode from '../../../../shared/discreetMode';
import Converter from '../../../../shared/converter';
import DialogLink from '../../../../toolbox/dialog/link';
import Icon from '../../../../toolbox/icon';
import styles from './balanceInfo.css';
import { fromRawLsk } from '../../../../../utils/lsk';
import SignInTooltipWrapper from '../../../../shared/signInTooltipWrapper';
import {
  calculateBalanceLockedInUnvotes,
  calculateBalanceLockedInVotes,
  getActiveTokenAccount,
} from '../../../../../utils/account';

const LockedBalanceLink = ({ activeToken, isWalletRoute }) => {
  const host = useSelector(state => getActiveTokenAccount(state));
  const lockedInVotes = useSelector(state => calculateBalanceLockedInVotes(state.voting));
  const lockedInUnvotes = activeToken === tokenMap.LSK.key && isWalletRoute && host
    ? calculateBalanceLockedInUnvotes(host.unlocking) : undefined;

  if (lockedInUnvotes + lockedInVotes > 0) {
    return (
      <DialogLink
        className={`${styles.lockedBalance} open-unlock-balance-dialog`}
        component="lockedBalance"
      >
        <Icon name="lock" />
        {`${fromRawLsk(lockedInUnvotes + lockedInVotes)} ${tokenMap.LSK.key}`}
      </DialogLink>
    );
  }

  return null;
};

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address, username,
}) => {
  const vote = useSelector(state => state.voting[address]);
  const initialValue = isWalletRoute
    ? {}
    : { recipient: address };

  const voteButtonTitle = vote ? t('Edit vote') : t('Add to votes');

  const sendTitle = isWalletRoute
    ? t('Send {{token}}', { token: activeToken })
    : t('Send {{token}} here', { token: activeToken });
  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('Balance')}</h2>
        <div className={styles.valuesRow}>
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <div className={`${styles.cryptoValue} balance-value`}>
              <LiskAmount val={balance} token={activeToken} />
              <Converter
                className={styles.fiatValue}
                value={fromRawLsk(balance)}
                error=""
              />

            </div>
            <LockedBalanceLink activeToken={activeToken} isWalletRoute={isWalletRoute} />
          </DiscreetMode>
        </div>
        <SignInTooltipWrapper position="bottom">
          <div className={styles.actionRow}>
            {
              username ? (
                <DialogLink component="editVote" className={`${styles.button} add-vote`}>
                  <SecondaryButton
                    className={`${styles.voteButton} open-add-vote-dialog`}
                    size="m"
                  >
                    {voteButtonTitle}
                  </SecondaryButton>
                </DialogLink>
              ) : null
            }
            <DialogLink component="send" className={`${styles.button} tx-send-bt`} data={initialValue}>
              <PrimaryButton
                className={`${styles.sendButton} ${styles[activeToken]} open-send-dialog`}
                size="m"
              >
                {sendTitle}
              </PrimaryButton>
            </DialogLink>
          </div>
        </SignInTooltipWrapper>

      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceInfo);
