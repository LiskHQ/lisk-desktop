import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Box from 'src/theme/box';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { TertiaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { Link } from 'react-router-dom';
import { parseSearchParams } from 'src/utils/searchParams';
import { usePinBlockchainApplication } from '../../hooks/usePinBlockchainApplication';
import styles from './BlockchainApplicationDetails.css';
import defaultBackgroundImage from '../../../../../../setup/react/assets/images/default-chain-background.png';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';

// TODO: this is a mock response of an application's details
const application = {
  data: {
    name: 'Test app',
    chainID: 'aq02qkbb35u4jdq8szo3pnsq',
    state: 'active',
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    lastCertificateHeight: 1000,
    lastUpdated: 123456789,
  },
};

const deposit = 5e10;
const serviceUrl = 'https://lisk.com/';
const backgroundImage = null;
const chainLogo = null;

const BlockchainApplicationDetails = ({ location }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const { checkPinByChainId, togglePin } = usePinBlockchainApplication();
  const {
    name, state, address, lastCertificateHeight, lastUpdated,
  } = application.data;

  const isPinned = checkPinByChainId(chainId);
  const toggleApplicationPin = () => {
    togglePin(chainId);
  };

  const footerDetails = [
    {
      header: {
        text: t('Chain ID'),
        toolTipText: t('The chain ID uniquely identifies a chain in the Lisk ecosystem'),
      },
      className: `${styles.detailContentText} chain-id`,
      content: chainId,
    },
    {
      header: t('Status'),
      className: `${styles.detailContentText} ${styles.statusChip} ${styles[state]} chain-status`,
      content: t(state),
    },
    {
      header: t('Last Update'),
      className: `${styles.detailContentText} last-update`,
      content: moment(lastUpdated).format('DD MMM YYYY'),
    },
    {
      header: t('Last Certificate Height'),
      className: `${styles.detailContentText} last-certificate-height`,
      content: lastCertificateHeight,
    },
  ];

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
            <TertiaryButton onClick={toggleApplicationPin}>
              <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
            </TertiaryButton>
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
          <div className={styles.balanceRow}>
            <span>{t('Deposited:')}</span>
            {/* TODO: this is a placeholder value pending when its part of service response */}
            <span>
              <TokenAmount val={deposit} />
              {' '}
              LSK
            </span>
          </div>
          <Box className={styles.footerDetailsRow}>
            {footerDetails.map(({ header, content, className }, index) => (
              <ValueAndLabel
                key={index}
                className={styles.detail}
                label={(
                  <span className={styles.headerText}>
                    <>
                      {header.text || header}
                      {header.toolTipText && (
                      <Tooltip position="right">
                        <p>
                          {header.toolTipText}
                        </p>
                      </Tooltip>
                      )}
                    </>
                  </span>
                  )}
              >
                <span className={className}>
                  {content}
                </span>
              </ValueAndLabel>
            ))}
          </Box>
        </Box>
      </div>
    </Dialog>
  );
};

export default BlockchainApplicationDetails;
