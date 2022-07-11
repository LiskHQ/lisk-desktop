import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Box from 'src/theme/box';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { TertiaryButton, PrimaryButton, OutlineButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { parseSearchParams } from 'src/utils/searchParams';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import styles from './RemoveApplicationDetails.css';
import liskLogo from '../../../../../../setup/react/assets/images/LISK.png';

const deposit = 5e10;
const serviceUrl = 'https://lisk.com/';
const chainLogo = null;

const BlockchainApplicationDetails = ({ location, application }) => {
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
      className: `${styles.detailContentText} ${styles.chainId} chain-id`,
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
        <Box className={styles.headerContainer}>
          <p>Remove application</p>
          <div>
            <img src={chainLogo || liskLogo} />
          </div>
        </Box>
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
          <Box className={styles.actionsRow}>
            <OutlineButton
              className={`${styles.button} ${styles.cancelButton}`}
            >
              {t('Cancel')}
            </OutlineButton>
            <PrimaryButton
              className={`${styles.button}`}
            >
              {t('Remove application now')}
            </PrimaryButton>
          </Box>
        </Box>
      </div>
    </Dialog>
  );
};

export default BlockchainApplicationDetails;
