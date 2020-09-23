import React from 'react';
import { withTranslation } from 'react-i18next';
import { PrimaryButton, SecondaryButton } from '../../../../toolbox/buttons';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import LiskAmount from '../../../../shared/liskAmount';
import DiscreetMode from '../../../../shared/discreetMode';
import Converter from '../../../../shared/converter';
import DialogLink from '../../../../toolbox/dialog/link';
import styles from './balanceInfo.css';
import { fromRawLsk } from '../../../../../utils/lsk';
import SignInTooltipWrapper from '../../../../shared/signInTooltipWrapper';
import { tokenMap } from '../../../../../constants/tokens';

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address,
}) => {
  const initialValue = isWalletRoute
    ? {}
    : { recipient: address };

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
              <LiskAmount val={balance} />
              {' '}
              <span>{activeToken}</span>
            </div>
            <Converter
              className={styles.fiatValue}
              value={fromRawLsk(balance)}
              error=""
            />
          </DiscreetMode>
        </div>
        <SignInTooltipWrapper position="bottom">
          <div className={styles.actionRow}>
            {
              activeToken === tokenMap.LSK.key && (
                <DialogLink component="addVote" className={`${styles.button} add-vote`}>
                  <SecondaryButton
                    className={`${styles.voteButton} open-add-vote-dialog`}
                    size="m"
                  >
                    {t('Add to votes')}
                  </SecondaryButton>
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
          </div>
        </SignInTooltipWrapper>

      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceInfo);
