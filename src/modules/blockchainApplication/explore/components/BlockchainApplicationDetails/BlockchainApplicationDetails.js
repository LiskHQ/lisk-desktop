import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
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
import styles from './BlockchainApplicationDetails.css';
import { usePinBlockchainApplication } from '../../hooks/usePinBlockchainApplication';

// TODO: this is a mock response of an application's details
const application = {
  data: {
    name: 'Test app',
    chainID: 'aq02qkbb35u4jdq8szo3pnsq',
    state: 'active',
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    lastCertificateHeight: 1000,
    lastUpdated: 123456789,
    deposit: 5e10,
    serviceUrl: 'https://enevti.com/',
  },
};

const BlockchainApplicationDetails = ({ location }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const { checkPinByChainId, deletePin, setPin } = usePinBlockchainApplication();
  const {
    name, state, address, lastCertificateHeight, lastUpdated, deposit, serviceUrl,
  } = application.data;

  const isPinned = checkPinByChainId(chainId);
  const toggleApplicationPin = () => {
    if (!isPinned) {
      setPin(chainId);
    } else {
      deletePin(chainId);
    }
  };

  const footerDetails = [
    {
      header: (
        <>
          {t('Chain ID')}
          <Tooltip position="right">
            <p>
              {t('')}
            </p>
          </Tooltip>
        </>
      ),
      className: `${styles.detailContentText} chain-id`,
      content: chainId,
    },
    {
      header: t('Status'),
      className: `${styles.detailContentText} ${styles.statusChip} ${styles[state]}`,
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
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div />
        <div>
          <div className={styles.avatarContainer}>
            <div>
              {/* TODO: chain logo goes here when its available from service's response */}
            </div>
          </div>
          <div className={styles.detailsWrapper}>
            <div className={styles.chainNameWrapper}>
              <span className="chain-name-text">{name}</span>
              <TertiaryButton onClick={toggleApplicationPin}>
                <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
              </TertiaryButton>
            </div>
            <div className={styles.addressRow}>
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
            </div>
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
            <div className={styles.footerDetailsRow}>
              {footerDetails.map(({ header, content, className }, index) => (
                <ValueAndLabel
                  key={index}
                  className={styles.detail}
                  label={(
                    <span className={styles.headerText}>
                      {header}
                    </span>
                  )}
                >
                  <span className={className}>
                    {content}
                  </span>
                </ValueAndLabel>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default BlockchainApplicationDetails;
