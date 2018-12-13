import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from '../create/create.css';
import PassphraseCreation from '../../passphraseCreation';
import Create from './create';

class CreateSecond extends React.Component {
  render() {
    return (
      <section className={`${grid.row} ${grid['center-xs']} ${styles.wrapper} ${styles.generation}`} >
        <PassphraseCreation t={this.props.t} nextStep={this.props.nextStep}>
          <Create {...this.props} />
        </PassphraseCreation>
      </section>
    );
  }
}

export default CreateSecond;
