import React from 'react';
import { tokenMap } from '@token/fungible/consts/tokens';
import { useLatestBlock } from '@block/hooks/queries/useLatestBlock';
import Tooltip from 'src/theme/Tooltip';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import ValueAndLabel from './valueAndLabel';
import styles from './styles.css';

const Confirmations = ({ t }) => {
  const {
    data: { height: currentHeight },
  } = useLatestBlock();
  const { activeToken, transaction } = React.useContext(TransactionDetailsContext);

  const confirmations = currentHeight - transaction.height;

  return (
    <ValueAndLabel
      className={styles.confirmations}
      label={
        <>
          {t('Confirmations')}
          <Tooltip position="top">
            <p>
              {t(
                'Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.',
                { token: tokenMap[activeToken].label }
              )}
            </p>
          </Tooltip>
        </>
      }
    >
      <span className="tx-confirmation">{confirmations}</span>
    </ValueAndLabel>
  );
};

export default Confirmations;
