import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import styles from './transactionDetailView.css';

class TransactionDetailViewField extends React.Component {
  render() {
    const { value, label, style, children, column, shouldShow } = this.props;
    return ((shouldShow === null || shouldShow === false) ? null :
      <div className={`${grid['col-xs-12']} ${grid['col-sm-5']} ${grid['col-md-5']} ${column ? styles.column : styles.columnNarrow}`}>
        <div className={styles.label}>{label}</div>
        {children}
        <div className={`${styles.value} ${style}`}>{value}</div>
      </div>
    );
  }
}

export default TransactionDetailViewField;
