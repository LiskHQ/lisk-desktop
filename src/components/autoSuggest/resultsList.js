import React from 'react';
import styles from './resultsList.css';

class ResultsList extends React.Component {
  getRowsForResults() {
    return this.props.results.map((entity, idx) => {
      const isSelectedRow = this.props.selectedIdx === this.props.entityIdxStart + idx;
      let rowProps = {
        onClick: () => this.props.submitSearch(this.props.redirectPath(entity)),
        className: `${styles.row} ${styles.rowResult} ${isSelectedRow ? styles.rowSelected : ''} ${this.props.entityKey}-result`,
      };
      if (isSelectedRow) {
        rowProps = { ...rowProps, ...this.props.selectedRowProps };
      }
      return <li {...rowProps} key={entity[this.props.uniqueKey]}>
        <span>{entity[this.props.keyHeader]}</span>
        {
          this.props.keyValue(entity)
        }
      </li>;
    });
  }

  render() {
    return this.props.results.length > 0 ?
      <ul className={styles.resultList} key={this.props.entityKey}>
        <li className={`${styles.row} ${styles.heading} ${this.props.entityKey}-header`}>
          <span>{this.props.i18Header}</span>
          <span>{this.props.i18Value}</span>
        </li>
        {this.getRowsForResults()}
      </ul> : null;
  }
}

export default ResultsList;
