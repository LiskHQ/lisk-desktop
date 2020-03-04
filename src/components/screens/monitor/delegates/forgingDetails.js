// istanbul ignore file
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import routes from '../../../../constants/routes';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import styles from './overview.css';

const ForgingDetails = ({
  t,
}) => {
  const awaitingForgers = useSelector(state => state.blocks.awaitingForgers);
  const latestBlocks = useSelector(state => state.blocks.latestBlocks);
  const lastForger = awaitingForgers
    .filter(forger =>
      forger.publicKey === latestBlocks[0].generatorPublicKey
      || forger.publicKey === latestBlocks[1].generatorPublicKey);

  return (
    <Box>
      <BoxHeader>
        <h1>{t('Forging details')}</h1>
      </BoxHeader>
      <div className={`${styles.container} ${styles.forgingDetails}`}>
        <div className={styles.column}>
          <h2 className={styles.title}>{t('Total forged')}</h2>
          <div className={styles.list}>
            <span>31,122,324</span>
          </div>
        </div>
        <div className={styles.column}>
          <h2 className={styles.title}>{t('Next forgers')}</h2>
          <nav className={styles.list}>
            {
              awaitingForgers
                .filter((item, index) => index < 9)
                .map(forger => (
                  <Link
                    key={forger.address}
                    className="forger-item"
                    to={`${routes.accounts.path}/${forger.address}`}
                  >
                    {forger.username}
                  </Link>
                ))
            }
          </nav>
        </div>
        <div className={styles.column}>
          <h2 className={styles.title}>{t('Last forger')}</h2>
          <nav className={styles.list}>
            {
              lastForger.length
                ? (
                  <Link
                    className="last-forger"
                    to={`${routes.accounts.path}/${lastForger[0].address}`}
                  >
                    {lastForger[0].username}
                  </Link>
                ) : null
            }
          </nav>
        </div>
      </div>
    </Box>
  );
};

export default ForgingDetails;
