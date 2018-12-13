import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import PassphraseCreation from '../../passphraseCreation';
import CreateFirst from './create';
import styles from './create.css';

class Create extends React.Component {
  render() {
    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} >
        <div className={grid['col-xs-12']} ref={ (pageRoot) => { this.pageRoot = pageRoot; } }>
          <PassphraseCreation t={this.props.t}>
            <CreateFirst {...this.props}/>
          </PassphraseCreation>
        </div>
      </section>
    );
  }
}

export default Create;
