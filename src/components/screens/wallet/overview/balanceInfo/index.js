import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import LiskAmount from '../../../../shared/liskAmount';
import DiscreetMode from '../../../../shared/discreetMode';
import Converter from '../../../../shared/converter';
import routes from '../../../../../constants/routes';
import styles from './balanceInfo.css';

const BalanceInfo = ({
  t, activeToken, balance, isWalletRoute, address,
}) => {
  const sendUrl = isWalletRoute
    ? `${routes.send.path}?wallet`
    : `${routes.send.path}?wallet&recipient=${address}`;

  const sendTitle = isWalletRoute
    ? t('Send {{token}}', { token: activeToken })
    : t('Send {{token}} here', { token: activeToken });
  return (
    <Box className={`${styles.wrapper}`}>
      <BoxContent className={styles.content}>
        <h2 className={styles.title}>{t('Balance')}</h2>
        <div className={styles.valuesRow}>
          <DiscreetMode shouldEvaluateForOtherAccounts>
            <div className={styles.cryptoValue}>
              <LiskAmount val={balance} />
              <span>{activeToken}</span>
            </div>
            <Converter
              className={styles.fiatValue}
              value={balance}
              error=""
            />
          </DiscreetMode>
        </div>
        <div className={styles.actionRow}>
          <Link to={sendUrl} className={`${styles.button} tx-send-bt`}>
            <PrimaryButton
              className="send-to-address"
              size="m"
            >
              {sendTitle}
            </PrimaryButton>
          </Link>
        </div>
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(BalanceInfo);
