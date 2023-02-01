import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from 'src/theme/buttons';
import DialogLink from 'src/theme/dialog/link';
import Tooltip from 'src/theme/Tooltip';
import { selectAccountBalance, selectLSKAddress } from 'src/redux/selectors';
import SignInTooltipWrapper from 'src/modules/common/components/signInTooltipWrapper';
import EmptyBalanceTooltipWrapper from './EmptyBalanceTooltipWrapper';
import styles from './BalanceInfo.css';

// eslint-disable-next-line complexity
const ActionBar = ({
  username,
  address,
  t,
  isWalletRoute,
  activeToken,
  isBanned,
  pomStart,
}) => {
  const hostBalance = useSelector(selectAccountBalance) // @todo account has multiple balance now;
  const disableButtons = hostBalance === 0;
  const stake = useSelector((state) => state.staking[address]);
  const lskAddress = useSelector(selectLSKAddress);
  const initialValue = isWalletRoute ? {} : { recipient: address };

  const stakeButtonTitle = stake ? t('Edit stake') : t('Add to stakes');

  const sendTitle = isWalletRoute
    ? t('Send {{token}}', { token: activeToken })
    : t('Send {{token}} here', { token: activeToken });

  return (
    <SignInTooltipWrapper position="bottom">
      <EmptyBalanceTooltipWrapper hostBalance={hostBalance}>
        <div className={styles.actionRow}>
          {username && (
            <DialogLink
              component={!isBanned && 'editStake'}
              data={pomStart}
              className={`${styles.button}`}
            >
              <Tooltip
                position="bottom"
                size="maxContent"
                content={(
                  <SecondaryButton
                    className={`${styles.stakeButton} ${
                      isBanned && styles.disabled
                    } ${!isBanned && 'open-add-stake-dialog'}`}
                    size="m"
                  >
                    {stakeButtonTitle}
                  </SecondaryButton>
                )}
              >
                <p>
                  {isBanned
                    ? t('You cannot stake for this validator')
                    : t('Stake for validator')}
                </p>
              </Tooltip>
            </DialogLink>
          )}
          {!username && lskAddress === address && (
            <DialogLink
              className={styles.registerValidator}
              component="registerValidator"
            >
              <TertiaryButton
                className="register-validator"
                size="m"
                disabled={disableButtons}
              >
                {t('Register validator')}
              </TertiaryButton>
            </DialogLink>
          )}
          <DialogLink
            component="send"
            className={`${styles.button} tx-send-bt`}
            data={initialValue}
          >
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
