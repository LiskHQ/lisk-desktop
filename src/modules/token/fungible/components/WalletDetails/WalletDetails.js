import React from 'react';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxRow from 'src/theme/box/row';
import Icon from 'src/theme/Icon';
import Converter from 'src/modules/common/components/converter';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import TokenAmount from '@token/fungible/components/tokenAmount';
import LockedBalanceLink from '@token/fungible/components/BalanceInfo/LockedBalanceLink';
import Skeleton from '@common/components/skeleton';
import styles from './WalletDetails.css';

const WalletDetails = ({ t, tokens, className, isWalletRoute, isLoading }) => (
  <Box className={`${styles.box} ${className}`}>
    <BoxHeader>
      <h1>{t('Wallet details')}</h1>
    </BoxHeader>
    <BoxContent className={`${styles.container} coin-container`}>
      {!isLoading && tokens?.map ? (
        tokens?.map((token) => (
          <BoxRow key={`${token.tokenID}`} className={`${styles.row} coin-row`}>
            <Link to={routes.wallet.path} className={styles.link}>
              <Icon name="lskIcon" />
              <div className={styles.details}>
                <span>{t('{{acctToken}} balance', { acctToken: token.symbol })}</span>
                <div className={styles.valuesRow}>
                  <div className={`${styles.cryptoValue} balance-value`}>
                    <div>
                      <TokenAmount val={token.availableBalance} token={token} />
                    </div>
                    <div>
                      <Converter
                        className={styles.fiatValue}
                        value={convertFromBaseDenom(token.availableBalance, token)}
                        error=""
                      />
                    </div>
                  </div>
                  <LockedBalanceLink
                    activeToken={token.symbol}
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
        ))
      ) : (
        <Skeleton className={styles.skeletonLoader} height="96px" width="100%" />
      )}
    </BoxContent>
  </Box>
);

export default WalletDetails;
