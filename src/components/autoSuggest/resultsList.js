import React from 'react';
import styles from './resultsList.css';

class ResultsList extends React.Component {
  getRowsForResults() {
    return this.props.results.map((result) => {
      let rowProps = {
        onClick: () => this.props.onClick(result.id, result.type),
        className: `${styles.row} ${styles.rowResult} ${result.isSelected ? styles.rowSelected : ''} ${result.type}-result`,
      };
      if (result.isSelected) {
        rowProps = { ...rowProps, ...this.props.selectedRowProps };
      }
      return <li {...rowProps} key={result.id}>
        <span>{result.valueLeft}</span>
        <span>{result.valueRight}</span>
      </li>;
    });
  }

  render() {
    return this.props.results.length > 0 ?
      <ul className={styles.resultList}>
        <li className={`${styles.row} ${styles.heading}`}>
          <span>{this.props.header.titleLeft}</span>
          <span>{this.props.header.titleRight}</span>
        </li>
        {this.getRowsForResults()}
      </ul> : null;
  }
}

export default ResultsList;
