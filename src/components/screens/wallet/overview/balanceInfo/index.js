import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectLSKAddress } from '@store/selectors';
import { tokenMap } from '@constants';
import { fromRawLsk } from '@utils/lsk';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import BoxContent from '@toolbox/box/content';
import DialogLink from '@toolbox/dialog/link';
import LiskAmount from '@shared/liskAmount';
import DiscreetMode from '@shared/discreetMode';
import Converter from '@shared/converter';
import SignInTooltipWrapper from '@shared/signInTooltipWrapper';
import LockedBalanceLink from './unlocking';
import styles from './balanceInfo.css';

const ButtonsWrapper = ({
  username, address, t, isWalletRoute, activeToken,
}) => {
  const vote = useSelector(state => state.voting[address]);
  const lskAddress = useSelector(selectLSKAddress);
  const initialValue = isWalletRoute
    ? {}
    : { recipient: address };

  const voteButtonTitle = vote ? t('Edit vote') : t('Add to votes');

  const sendTitle = isWalletRoute
    ? t('Send {{token}}', { token: activeToken })
    : t('Send {{token}} here', { token: activeToken });

  return (
    <>
      {
        username && (
          <DialogLink component="editVote" className={`${styles.button} add-vote`}>
            <SecondaryButton
              className={`${styles.voteButton} open-add-vote-dialog`}
              size="m"
            >
              {voteButtonTitle}
            </SecondaryButton>
          </DialogLink>
        )
      }
      {
        (!username && lskAddress === address) && (
          <DialogLink
            className={`${styles.registerDelegate} register-delegate`}
            component="registerDelegate"
          >
            {t('Register delegate')}
          </DialogLink>
        )
      }
      <DialogLink component="send" className={`${styles.button} tx-send-bt`} data={initialValue}>
        <PrimaryButton
          className={`${styles.sendButton} ${styles[activeToken]} open-send-dialog`}
          size="m"
        >
          {sendTitle}
        </PrimaryButton>
      </DialogLink>
    </>
  );
};

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address, username,
}) => (
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
        <div className={styles.actionRow}>
          <ButtonsWrapper
            address={address}
            username={username}
            t={t}
            isWalletRoute={isWalletRoute}
            activeToken={activeToken}
          />
        </div>
      </SignInTooltipWrapper>
    </BoxContent>
  </Box>
);

export default withTranslation()(BalanceInfo);
