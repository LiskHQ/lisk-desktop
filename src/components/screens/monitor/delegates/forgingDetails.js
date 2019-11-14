import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';

const ForgingDetails = ({ t, delegates, sortDirection }) => {
  // When sorting changes, delegates.data is reversed
  // TODO: Check for alternative solution
  const delegatesList = sortDirection.includes('asc') ? [...delegates.data] : [...delegates.data].reverse();

  const lastForger = [...delegatesList].sort(
    (a, b) =>
      b.lastBlock && a.lastBlock && b.lastBlock.height - a.lastBlock.height,
  )[0];

  const nextForgers = [...delegatesList]
    .sort((a, b) => a.forgingTime - b.forgingTime)
    .slice(0, 10);
  return (
    <Box>
      <BoxHeader>
        <h2>{t('Forging details')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={styles.contentWrapper}>
          <div>
            <h3>{t('Total forged')}</h3>
            <div className={styles.totalForged}>Content</div>
          </div>
          <div>
            <h3>{t('Next forgers')}</h3>
            <div className={styles.contentBody}>
              {nextForgers.map((delegate, i) => (
                <span key={delegate.address}>
                  {`${delegate.username}${
                    i !== nextForgers.length - 1 ? ', ' : ''
                  }`}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3>{t('Last forger')}</h3>
            <div className={styles.contentBody}>{lastForger && lastForger.username}</div>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ForgingDetails;
