import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { tokenMap } from '@token/fungible/consts/tokens';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxRow from 'src/theme/box/row';
import Icon from 'src/theme/Icon';
import Converter from 'src/modules/common/components/converter';
import { fromRawLsk } from '@token/fungible/utils/lsk';
import TokenAmount from '@token/fungible/components/tokenAmount';
import DiscreetMode from 'src/modules/common/components/discreetMode';
import LockedBalanceLink from '@token/fungible/components/BalanceInfo/LockedBalanceLink';
import styles from './WalletDetails.css';

const WalletDetails = ({
  t, tokens, className, isWalletRoute,
}) => <Box className={`${styles.box} ${className}`}>
    <BoxHeader>
      <h1>{t('Wallet details')}</h1>
    </BoxHeader>
    <BoxContent className={`${styles.container} coin-container`}>
      {tokens?.map((token) => (
        <BoxRow
          key={`${token.tokenID}`}
          className={`${styles.row} coin-row`}
        >
          <Link
            to={routes.wallet.path}
            className={styles.link}
          >
            <Icon name="lskIcon" />
            <div className={styles.details}>
              <span>
                {t('{{acctToken}} balance', { acctToken: tokenMap.LSK.key })}
              </span>
              <div className={styles.valuesRow}>
                  <div className={`${styles.cryptoValue} balance-value`}>
                    <div><TokenAmount val={token.availableBalance} token={tokenMap.LSK.key} /></div>
                    <div>
                      <Converter
                        className={styles.fiatValue}
                        value={fromRawLsk(token.availableBalance)}
                        error=""
                      />
                    </div>
                  </div>
                  <LockedBalanceLink
                    activeToken={tokenMap.LSK.key}
                    isWalletRoute={isWalletRoute}
                    style={styles.lockedBalance}
                    icon="lockedBalance"
                    // TODO: Fix locked balance details
                    account={{}}
                  />
              </div>
            </div>
          </Link>
        </BoxRow>
      ))}
    </BoxContent>
  </Box>


export default WalletDetails;
