import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap, initialLSKSupply } from '../../../../constants/tokens';

const ForgingDetails = ({
  t, delegates, sortDirection, networkStatus,
}) => {
  const delegatesList = sortDirection && sortDirection.includes('asc') ? [...delegates.data] : [...delegates.data].reverse();
  const totalForged = networkStatus && networkStatus.data.supply - initialLSKSupply;

  const lastForger = [...delegatesList].sort(
    (a, b) =>
      b.lastBlock && a.lastBlock && b.lastBlock.height - a.lastBlock.height,
  )[0];

  const nextForgers = [...delegatesList]
    .filter(d => d.forgingTime)
    .slice(0, 10)
    .sort((a, b) => a.forgingTime - b.forgingTime);
  return (
    <Box>
      <BoxHeader>
        <h2>{t('Forging details')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={styles.contentWrapper}>
          <div>
            <h3>{t('Total forged')}</h3>
            <div className={styles.totalForged}>
              <LiskAmount className="total-forged" val={totalForged} token={tokenMap.LSK.key} />
            </div>
          </div>
          <div>
            <h3>{t('Next forgers')}</h3>
            <div className={styles.contentBody}>
              {nextForgers.map((delegate, i) => (
                <span className="next-forger" key={delegate.address}>
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
