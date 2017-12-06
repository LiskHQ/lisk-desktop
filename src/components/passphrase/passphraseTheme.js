import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './passphrase.css';

const PassphraseTheme = ({ children }) => (
  <section className={`${styles.templateItem} ${grid.row} ${grid['middle-xs']}`}>
    <div className={grid['col-xs-12']}>
      { children }
    </div>
  </section>
);

export default PassphraseTheme;
