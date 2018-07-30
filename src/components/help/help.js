import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../box';
import styles from './help.css';

class Help extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Box className={styles.wrapper}>
        <aside className={`${grid['col-sm-12']} ${grid['col-md-4']} ${styles.helpSection} ${styles.sideBar}`}>
          <div>HELP CENTER</div>
        </aside>

        <section className={`${grid['col-sm-12']} ${grid['col-md-8']} ${styles.helpSection}`}>
          <div>LINKS </div>
        </section>
      </Box>
    );
  }
}

export default Help;
