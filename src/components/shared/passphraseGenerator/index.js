import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './passphraseGenerator.css';

class PassphraseGenerator extends React.Component {
  render() {
    const { values } = this.props;
    return (
      <div className={styles.container}>
        <div className={`${styles.inputsRow} ${grid.row} passphrase`}>
          {values.slice(0, 6).map((value, i) => (
            <React.Fragment key={i}>
              <span className={`${grid['col-xs-2']} ${styles.inputValue}`}>{value}</span>
              <span className={styles.whitespace}>&nbsp;</span>
            </React.Fragment>
          ))}
        </div>
        <div className={`${styles.inputsRow} ${grid.row} passphrase`}>
          {values.slice(6, 12).map((value, i) => (
            <React.Fragment key={i}>
              <span className={`${grid['col-xs-2']} ${styles.inputValue}`}>{value}</span>
              <span className={styles.whitespace}>&nbsp;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default PassphraseGenerator;
