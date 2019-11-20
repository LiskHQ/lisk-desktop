import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import styles from './forgingDetails.css';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap, initialLSKSupply } from '../../../../constants/tokens';
import routes from '../../../../constants/routes';

const ForgingDetails = ({
  t, networkStatus, lastBlock, nextForgers,
}) => {
  const totalForged = networkStatus && networkStatus.data.supply - initialLSKSupply;

  return (
    <Box>
      <BoxHeader>
        <h2>{t('Forging details')}</h2>
      </BoxHeader>
      <BoxContent>
        <div className={`${styles.contentWrapper} ${grid.row}`}>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Total forged')}</h3>
            {!!totalForged && (
              <div className={styles.totalForged}>
                <LiskAmount className="total-forged" val={totalForged} token={tokenMap.LSK.key} />
              </div>
            )}
          </div>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Next forgers')}</h3>
            <div className={styles.contentBody}>
              {nextForgers && nextForgers.map((delegate, i) => (
                <span key={delegate.address}>
                  <Link className="next-forger" to={`${routes.accounts.path}/${delegate.address}`}>
                    {delegate.username}
                  </Link>
                  {i !== nextForgers.length - 1 ? ', ' : ' '}
                </span>
              ))}
            </div>
          </div>
          <div className={`${grid['col-sm-4']} ${styles.content}`}>
            <h3>{t('Last forger')}</h3>
            <div className={styles.contentBody}>
              {lastBlock && (
                <Link to={`${routes.accounts.path}/${lastBlock.generatorUsername}`}>{lastBlock.generatorUsername}</Link>
              )}
            </div>
          </div>
        </div>
      </BoxContent>
    </Box>
  );
};

export default ForgingDetails;
