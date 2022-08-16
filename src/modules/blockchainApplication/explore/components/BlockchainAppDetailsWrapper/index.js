import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Box from 'src/theme/box';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import styles from './BlockchainAppDetailsWrapper.css';
import defaultBackgroundImage from '../../../../../../setup/react/assets/images/default-chain-background.png';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';

const serviceUrl = 'https://lisk.com/';
const backgroundImage = null;
const chainLogo = null;

const BlockchainAppDetailsWrapper = ({ application, children, chainAction }) => {
  const { t } = useTranslation();
  const { name, address } = application.data;

  return (
    <Dialog hasClose className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div className={styles.avatarContainer}>
          <img src={chainLogo || liskLogo} />
          <img src={backgroundImage || defaultBackgroundImage} />
        </div>
        <Box className={styles.detailsWrapper}>
          <div className={styles.chainNameWrapper}>
            <span className="chain-name-text">{name}</span>
            {chainAction}
          </div>
          <Box className={styles.addressRow}>
            <ValueAndLabel className={styles.transactionId}>
              <span className="copy-address-wrapper">
                <CopyToClipboard
                  text={address}
                  value={address}
                  className="tx-id"
                  containerProps={{
                    size: 'xs',
                    className: 'copy-address',
                  }}
                />
              </span>
            </ValueAndLabel>
          </Box>
          <div className={styles.addressRow}>
            <Link
              className={`${styles.appLink}`}
              target="_blank"
                // eslint-disable-next-line
                // TODO: this is just a place holder link pending when its part of the response payload from service
              to={serviceUrl}
            >
              <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
              {t(serviceUrl)}
            </Link>
          </div>
          { children }
        </Box>
      </div>
    </Dialog>
  );
};

export default BlockchainAppDetailsWrapper;
