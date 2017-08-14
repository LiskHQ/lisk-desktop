import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import Input from 'react-toolbox/lib/input';
import styles from './voting.css';
import Confirm from './confirmVotes';

class VotingHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      searchIcon: 'search',
    };
  }

  search(name, value) {
    const icon = value.length > 0 ? 'close' : 'search';
    this.setState({
      query: value,
      searchIcon: icon,
    });
    this.props.search(value);
  }

  clearSearch() {
    if (this.state.searchIcon === 'close') {
      this.search('query', '');
    }
  }

  confirmVoteText() {
    let info = 'VOTE';
    const voted = this.props.votedList.filter(item => !item.pending).length;
    const unvoted = this.props.unvotedList.filter(item => !item.pending).length;
    if (voted > 0 || unvoted > 0) {
      const seprator = (voted > 0 && unvoted > 0) ? ' / ' : ''; // eslint-disable-line
      const votedHtml = voted > 0 ? <span className={styles.voted}>+{voted}</span> : '';
      const unvotedHtml = unvoted > 0 ? <span className={styles.unvoted}>-{unvoted}</span> : '';
      info = <span>VOTE ({votedHtml}{seprator}{unvotedHtml})</span>;
    }
    return info;
  }

  render() {
    const button = <div className={styles.votesMenuButton}>
      <i className="material-icons">visibility</i>
      <span>my votes ({this.props.votedDelegates.length})</span>
    </div>;
    return (
      <header className={`${grid.row} ${grid['between-xs']} hasPaddingRow`}>
        <div className={`${grid['col-xs-3']} ${styles.searchBox}`}>
          <Input type='tel' label='Search' name='query'
            theme={styles}
            value={this.state.query}
            onChange={this.search.bind(this, 'query')}
          />
          <i id="searchIcon" className={`material-icons ${styles.searchIcon}`} onClick={ this.clearSearch.bind(this) }>
            {this.state.searchIcon}
          </i>
        </div>
        <div className={styles.actionBar}>
          <IconMenu theme={styles} icon={button} position='topLeft' iconRipple={false}>
            {this.props.votedDelegates.map(delegate =>
              <MenuItem
                theme={styles}
                key={delegate.username}
                caption={delegate.username}
                icon="close"
                onClick={this.props.addToUnvoted.bind(this, delegate)} />)}
          </IconMenu>
          <Button icon='done' flat
            onClick={() => this.props.setActiveDialog({
              title: 'Verify Vote for delegates',
              childComponent: Confirm,
              childComponentProps: {
                addTransaction: this.props.addTransaction,
              },
            })}
            label={this.confirmVoteText()} />
        </div>
      </header>
    );
  }
}
export default VotingHeader;
