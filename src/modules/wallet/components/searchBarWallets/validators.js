import React from 'react';
import Highlighter from 'react-highlight-words';
import WalletVisual from '@wallet/components/walletVisual';
import { truncateAddress } from '@wallet/utils/account';
import styles from './walletsAndValidators.css';

const Validators = ({
  validators,
  onSelectedRow,
  t,
  rowItemIndex,
  updateRowItemIndex,
  searchTextValue,
}) => (
  <div className={`${styles.wrapper} validators`}>
    <header className={`${styles.header} validators-header`}>
      <label>{t('Account')}</label>
    </header>
    <div className={`${styles.content} validators-content`} data-testid="validators-content">
      {validators.map((validator, index) => (
        <div
          key={index}
          data-index={index}
          className={`${styles.accountRow} ${
            rowItemIndex === index ? styles.active : ''
          } validators-row`}
          onClick={() => onSelectedRow(validator.address)}
          onMouseEnter={updateRowItemIndex}
        >
          <WalletVisual address={validator.address} />
          <div className={styles.walletInformation}>
            <div>
              <span className={`${styles.validatorName} validator-name`}>
                <Highlighter
                  highlightClassName={styles.highlight}
                  searchWords={[searchTextValue]}
                  autoEscape
                  textToHighlight={validator.name}
                />
              </span>
            </div>
            <span className={`${styles.accountSubtitle} hideOnLargeViewPort`}>
              {truncateAddress(validator.address)}
            </span>
            <span className={`${styles.accountSubtitle} showOnLargeViewPort`}>
              {validator.address}
            </span>
          </div>
          <span className={styles.accountBalance}>
            <span className={styles.tag}>{t('Validator #{{rank}}', { rank: validator.rank })}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default Validators;
