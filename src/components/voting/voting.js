import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './voting.css';
import DelegateSidebar from '../delegateSidebar';
import DelegateList from '../delegateList';

const Voting = ({ votes }) => (
  <div className={`${grid.row} ${styles.wrapper}`} >
    <aside className={`${grid['col-md-4']}`}>
      <DelegateSidebar votes={votes} />
    </aside>
    <section className={`${grid['col-sm-12']} ${grid['col-md-8']}`}>
      <DelegateList />
    </section>
  </div>
);

export default Voting;
