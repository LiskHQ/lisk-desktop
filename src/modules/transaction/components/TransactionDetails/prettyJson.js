import React from 'react';
import ReactJson from 'react-json-view';
import { useTheme } from 'src/theme/Theme';
import TransactionDetailsContext from '../../context/transactionDetailsContext';
import styles from './styles.css';

const PrettyJson = ({ t }) => {
  const { transaction } = React.useContext(TransactionDetailsContext);
  const theme = useTheme();
  const jsonViewerTheme = theme === 'dark' ? 'monokai' : 'rjv-default';

  return (
    transaction &&
    Object.keys(transaction.params).length > 0 && (
      <div className={styles.transactionParams}>
        <p className={styles.label}>{t('Transaction params')}</p>
        <div>
          <ReactJson src={transaction.params} theme={jsonViewerTheme} />
        </div>
      </div>
    )
  );
};

export default PrettyJson;
