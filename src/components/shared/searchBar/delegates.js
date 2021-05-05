import React from 'react';
import Highlighter from 'react-highlight-words';
import AccountVisual from '@toolbox/accountVisual';
import styles from './accountsAndDeletegates.css';

const Delegates = ({
  delegates, onSelectedRow, t, rowItemIndex, updateRowItemIndex, searchTextValue,
}) => (
  <div className={`${styles.wrapper} delegates`}>
    <header className={`${styles.header} delegates-header`}>
      <label>{t('Account')}</label>
    </header>
    <div className={`${styles.content} delegates-content`}>
      {
      delegates.map((delegate, index) => (
        <div
          key={index}
          data-index={index}
          className={`${styles.accountRow} ${rowItemIndex === index ? styles.active : ''} delegates-row`}
          onClick={() => onSelectedRow(delegate.address)}
          onMouseEnter={updateRowItemIndex}
        >
          <AccountVisual address={delegate.address} />
          <div className={styles.accountInformation}>
            <div>
              <span className={`${styles.delegateName} delegate-name`}>
                <Highlighter
                  highlightClassName={styles.highlight}
                  searchWords={[searchTextValue]}
                  autoEscape
                  textToHighlight={delegate.username}
                />
              </span>
            </div>
            <span className={styles.accountSubtitle}>{delegate.address}</span>
          </div>
          <span className={styles.accountBalance}>
            <span className={styles.tag}>
              {t('Delegate #{{rank}}', { rank: delegate.rank })}
            </span>
          </span>
        </div>
      ))
    }
    </div>
  </div>
);

export default Delegates;
