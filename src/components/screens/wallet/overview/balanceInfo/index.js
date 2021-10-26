import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { tokenMap } from '@constants';
import { fromRawLsk } from '@utils/lsk';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import DialogLink from '@toolbox/dialog/link';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import Converter from '@shared/converter';
import SignInTooltipWrapper from '@shared/signInTooltipWrapper';
import { selectAccountBalance } from '@store/selectors';
import LockedBalanceLink from './unlocking';
import EmptyBalanceTooltipWrapper from './emptyBalanceTooltipWrapper';
import styles from './balanceInfo.css';

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address, username,
}) => {
  const hostBalance = useSelector(selectAccountBalance);
  const disableButtons = hostBalance === 0;
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
            {
              activeToken === tokenMap.LSK.key && isWalletRoute ? (
                <LockedBalanceLink activeToken={activeToken} isWalletRoute={isWalletRoute} />
              ) : null
            }
          </DiscreetMode>
        </div>
        <SignInTooltipWrapper position="bottom">
          <EmptyBalanceTooltipWrapper hostBalance={hostBalance}>
            <div className={styles.actionRow}>
              {
                username ? (
                  <DialogLink component="editVote" className={`${styles.button} add-vote`}>
                    <SecondaryButton
                      className={`${styles.voteButton} open-add-vote-dialog`}
                      size="m"
                      disabled={disableButtons}
                    >
                      {voteButtonTitle}
                    </SecondaryButton>
                  </DialogLink>
                ) : (
                  <DialogLink
                    className={`${styles.registerDelegate} register-delegate`}
                    component="registerDelegate"
                  >
                    <TertiaryButton
                      size="m"
                      disabled={disableButtons}
                    >
                      {t('Register delegate')}
                    </TertiaryButton>
                  </DialogLink>
                )
              }
              <DialogLink component="send" className={`${styles.button} tx-send-bt`} data={initialValue}>
                <PrimaryButton
                  className={`${styles.sendButton} ${styles[activeToken]} open-send-dialog`}
                  size="m"
                  disabled={disableButtons}
                >
                  {sendTitle}
                </PrimaryButton>
              </DialogLink>
            </div>
          </EmptyBalanceTooltipWrapper>
        </SignInTooltipWrapper>
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceInfo);
