import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Box from 'src/theme/box';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Icon from 'src/theme/Icon';
import styles from './blockchainAppDetailsHeader.css';

const BlockchainAppDetailsWrapper = ({ application, chainAction }) => {
  const { t } = useTranslation();
  const {
    name, address, serviceUrl, icon, bg,
  } = application.data;

  return (
    <header>
      <div className={styles.avatarContainer}>
        <img src={icon} className={styles.logo} />
        {
          !!bg && <img src={bg} className={styles.bg} />
        }
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
      </Box>
    </header>
  );
};

export default BlockchainAppDetailsWrapper;
