import React from 'react';
import QRCode from 'qrcode.react';
import { withTranslation } from 'react-i18next';
import AccountVisual from '../../toolbox/accountVisual';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import BoxRow from '../../toolbox/box/row';
import Icon from '../../toolbox/icon';
import LiskAmount from '../../shared/liskAmount';
import CopyToClipboard from '../../toolbox/copyToClipboard';
import DiscreetMode from '../../shared/discreetMode';
import { getAddress } from '../../../utils/hwManager';
import styles from './walletDetails.css';
import Tooltip from '../../toolbox/tooltip/tooltip';

class WalletDetails extends React.Component {
  render() {
    const {
      balance, t, address, activeToken, account,
    } = this.props;

    return (
      <Box className={styles.wrapper}>
        <BoxHeader>
          <h1>{t('Wallet details')}</h1>
        </BoxHeader>
        <BoxRow className={styles.row}>
          <AccountVisual
            address={address}
            size={40}
          />
          <div>
            <label>{t('Address')}</label>
            <div className={styles.value}>
              <span className="account-address">{address}</span>
            </div>
          </div>
          <div className={styles.addressIcons}>
            <div className={styles.helperIcon}>
              <CopyToClipboard
                value={address}
                type="icon"
                copyClassName={styles.copyIcon}
              />
            </div>
            <div className={styles.helperIcon}>
              <Tooltip
                tooltipClassName={styles.qrCodeWrapper}
                className="showOnBottom"
                title={t('Scan address')}
                content={<Icon name="qrCodeActive" className={styles.qrCodeIcon} />}
              >
                <QRCode value={address} size={154} />
              </Tooltip>
            </div>
            {
              (typeof account.loginType === 'number' && account.loginType !== 0)
                ? (
                  <div
                    className={`${styles.helperIcon} verify-address`}
                    onClick={() => getAddress({
                      deviceId: account.hwInfo.deviceId,
                      index: account.hwInfo.derivationIndex,
                      showOnDevice: true,
                    })}
                  >
                    <Tooltip
                      className="showOnBottom"
                      title={t('Verify address')}
                      content={<Icon name="verifyWalletAddressActive" className={styles.qrCodeIcon} />}
                    >
                      <span>{t('Verify the address in your hardware wallet device.')}</span>
                    </Tooltip>
                  </div>
                )
                : null
            }
          </div>
        </BoxRow>
        <BoxRow className={styles.row}>
          <Icon name="balance" />
          <div>
            <label>{t('Balance')}</label>
            <DiscreetMode shouldEvaluateForOtherAccounts>
              <div className={styles.value}>
                <LiskAmount val={balance} />
                {' '}
                {activeToken}
              </div>
            </DiscreetMode>
          </div>
        </BoxRow>
      </Box>
    );
  }
}

export default withTranslation()(WalletDetails);
