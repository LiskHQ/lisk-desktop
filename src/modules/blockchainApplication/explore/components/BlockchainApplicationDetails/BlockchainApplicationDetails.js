import React from 'react';
import { useTranslation } from 'react-i18next';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import { TertiaryButton } from 'src/theme/buttons';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { Link } from 'react-router-dom';
import styles from './BlockchainApplicationDetails.css';

const BlockchainApplicationDetails = () => {
  const { t } = useTranslation();
  console.log('>>>', t);

  const footerDetails = [
    {
      header: <span className={styles.headerText}>
        {t('Confirmations')}
        <Tooltip position="right">
          <p>
            {t('ksdjfkjsdfjsdf')}
          </p>
        </Tooltip>
      </span>,
      content: <span className={styles.detailContentText}>10</span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Status')}
      </span>,
      content: <span className={`${styles.detailContentText} ${styles.statusChip} ${styles.reigstered}`}>
        {t('registered')}
      </span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Last Update')}
      </span>,
      content: <span className={styles.detailContentText}>26 Jan 2022</span>,
    },
    {
      header: <span className={styles.headerText}>
        {t('Last Certificate Height')}
      </span>,
      content: <span className={styles.detailContentText}>156785</span>,
    },
  ];

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']}`}>
      <div className={styles.wrapper}>
        <div />
        <div>
          <div className={styles.avatarContainer}>
            {/* just a place holder */}
            <div style={{ backgroundColor: 'white ' }}>
              sdf
            </div>
          </div>
          <div className={styles.detailsWrapper}>
            <div className={styles.chainNameWrapper}>
              <span>Enevti</span>
              <TertiaryButton><Icon name="pinnedIcon" /></TertiaryButton>
            </div>
            <div className={styles.addressRow}>
              <ValueAndLabel className={styles.transactionId}>
                <span className="copy-address-wrapper">
                  <CopyToClipboard
                    text="lskemxs5ac6y8vaf2yp6njx9hnk5shdhutdu9prpc"
                    value="lskemxs5ac6y8vaf2yp6njx9hnk5shdhutdu9prpc"
                    className="tx-id"
                    containerProps={{
                      size: 'xs',
                      className: 'copy-title',
                    }}
                    copyClassName={styles.copyIcon}
                  />
                </span>
              </ValueAndLabel>
            </div>
            <div className={styles.addressRow}>
              <Link
                className={`${styles.appLink} signin-hwWallet-button`}
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
