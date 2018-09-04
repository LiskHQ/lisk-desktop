import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import styles from './transactionDetailView.css';

class TransactionDetailViewRow extends React.Component {
  render() {
    const { children, shouldShow } = this.props;
    return ((shouldShow !== undefined && !shouldShow) ? null :
      <div className={`${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}  grid-row`}>
        {children}
      </div>
    );
  }
}

export default TransactionDetailViewRow;
