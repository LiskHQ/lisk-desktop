import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Box from 'src/theme/box';
import { useSelector } from 'react-redux';
import { selectActiveToken } from 'src/redux/selectors';
import TokenAmount from '@token/fungible/components/tokenAmount';
import ValueAndLabel from 'src/modules/transaction/components/TransactionDetails/valueAndLabel';
import { TertiaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import Tooltip from 'src/theme/Tooltip';
import { parseSearchParams } from 'src/utils/searchParams';
import { usePinBlockchainApplication } from '@blockchainApplication/manage/hooks/usePinBlockchainApplication';
import styles from './BlockchainApplicationDetails.css';
import BlockchainAppDetailsWrapper from '../BlockchainAppDetailsWrapper';

const deposit = 5e10;

const BlockchainApplicationDetails = ({ location, application }) => {
  const { t } = useTranslation();
  const active = useSelector(selectActiveToken);
  const chainId = parseSearchParams(location.search).chainId;
  const { checkPinByChainId, togglePin } = usePinBlockchainApplication();
  const {
    state, lastCertificateHeight, lastUpdated,
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
    <BlockchainAppDetailsWrapper
      application={application}
      chainAction={(
        <TertiaryButton className="chain-details-pin-button" onClick={toggleApplicationPin}>
          <Icon data-testid="pin-button" name={isPinned ? 'pinnedIcon' : 'unpinnedIcon'} />
        </TertiaryButton>
      )}
    >
      <>
        <div className={styles.balanceRow}>
          <ValueAndLabel
            label={t('Deposited:')}
            direction="horizontal"
          >
            <span className={styles.value}>
              <TokenAmount val={deposit} token={active} />
            </span>
          </ValueAndLabel>
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
      </>
    </BlockchainAppDetailsWrapper>
  );
};

export default BlockchainApplicationDetails;
