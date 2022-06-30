import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
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

const BlockchainApplicationDetails = ({ location }) => {
  const { t } = useTranslation();
  const chainId = parseSearchParams(location.search).chainId;
  const { checkPinByChainId, deletePin, setPin } = usePinBlockchainApplication();
  const {
    name, state, address, lastCertificateHeight, lastUpdated,
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
      header: <span className={styles.headerText}>
        {t('Chain ID')}
        <Tooltip position="right">
          <p>
            {t('')}
          </p>
        </Tooltip>
      </span>,
      content: <span className={styles.detailContentText}>{chainId}</span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Status')}
      </span>,
      content: <span className={`${styles.detailContentText} ${styles.statusChip} ${styles[state]}`}>
        {t(state)}
      </span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Last Update')}
      </span>,
      content: <span className={styles.detailContentText}>{moment(lastUpdated).format('DD MMM YYYY')}</span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Last Certificate Height')}
      </span>,
      content: <span className={styles.detailContentText}>{lastCertificateHeight}</span>,
    },
  ];

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div />
        <div>
          <div className={styles.avatarContainer}>
            {/* just a place holder */}
            <div>
              sdf
            </div>
          </div>
          <div className={styles.detailsWrapper}>
            <div className={styles.chainNameWrapper}>
              <span>{name}</span>
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
                to="https://enevti.com/"
              >
                <Icon name="chainLinkIcon" className={styles.hwWalletIcon} />
                {t('https://enevti.com/')}
              </Link>
            </div>
            <div className={styles.balanceRow}>
              <span>Deposited:</span>
              <span>5,351.859 LSK</span>
            </div>
            <div className={styles.footerDetailsRow}>
              {footerDetails.map(({ header, content }, index) => (
                <ValueAndLabel
                  key={index}
                  className={styles.detail}
                  label={header}
                >
                  {content}
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
