import React from 'react';
import { connect } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';

const ConfirmVotes = props => (
  <article>
    <h3>Add vote to</h3>
    <ul>
      {props.votedList.map(item => <li key={item.username}>{item.username}</li>)}
    </ul>
    <h3>Remove vote from</h3>
    <ul>
      {props.unvotedList.map(item => <li key={item.username}>{item.username}</li>)}
    </ul>
    <footer className={`${grid.row} ${grid['between-xs']}`}>
        <Button key={0} label='Cancel' className='cancel-button' onClick={props.closeDialog} />
        <Button key={1} label='Confirm'
          className='send-button'
          primary={true} raised={true}
          disabled={props.votedList.length === 0 && props.unvotedList.length === 0}
          onClick={props.closeDialo}/>
      </footer>
  </article>
);

const mapStateToProps = state => ({
  votedList: state.voting.votedList,
  unvotedList: state.voting.unvotedList,
});

export default connect(mapStateToProps)(ConfirmVotes);
