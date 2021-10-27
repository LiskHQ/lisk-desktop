import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@toolbox/buttons';
import DialogLink from '@toolbox/dialog/link';
import Tooltip from '@toolbox/tooltip/tooltip';
import SignInTooltipWrapper from '@shared/signInTooltipWrapper';
import { selectAccountBalance, selectLSKAddress } from '@store/selectors';
import EmptyBalanceTooltipWrapper from './emptyBalanceTooltipWrapper';
import styles from './balanceInfo.css';

// eslint-disable-next-line complexity
const ActionBar = ({
  username, address, t, isWalletRoute, activeToken, isBanned,
  pomStart,
}) => {
  const hostBalance = useSelector(selectAccountBalance);
  const disableButtons = hostBalance === 0;
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
    <SignInTooltipWrapper position="bottom">
      <EmptyBalanceTooltipWrapper hostBalance={hostBalance}>
        <div className={styles.actionRow}>
          {
            username && (
              <DialogLink
                component={!isBanned && 'editVote'}
                data={pomStart}
                className={`${styles.button} add-vote`}
              >
                <Tooltip
                  position="bottom"
                  size="maxContent"
                  content={(
                    <SecondaryButton
                      className={`${styles.voteButton} ${
                        isBanned && styles.disabled} ${!isBanned && 'open-add-vote-dialog'}`}
                      size="m"
                    >
                      {voteButtonTitle}
                    </SecondaryButton>
                  )}
                >
                  <p>
                    {isBanned
                      ? t('You cannot vote for this delegate')
                      : t('Vote for delegate')}
                  </p>
                </Tooltip>
              </DialogLink>
            )
          }
          {
            (!username && lskAddress === address) && (
              <DialogLink
                className={styles.registerDelegate}
                component="registerDelegate"
              >
                <TertiaryButton
                  className="register-delegate"
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
  );
};

export default withTranslation()(ActionBar);
