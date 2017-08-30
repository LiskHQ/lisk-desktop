import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button } from 'react-toolbox/lib/button';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import Input from 'react-toolbox/lib/input';
import styles from './voting.css';
import disableStyle from './disableMenu.css';
import VoteDialog from '../voteDialog';

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
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value === this.state.query) {
        this.props.search(value);
      }
    }, 250);
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
    const theme = this.props.votedDelegates.length === 0 ? disableStyle : styles;
    const button = <div className={styles.votesMenuButton}>
      <i className='material-icons'>visibility</i>
      <span>my votes ({this.props.votedDelegates.length})</span>
    </div>;
    return (
      <header className={`${grid.row} ${grid['between-xs']} hasPaddingRow`}>
        <div className={`${grid['col-xs-3']} ${styles.searchBox}`}>
          <Input type='tel' label='Search' name='query'
            className='search'
            theme={styles}
            value={this.state.query}
            onChange={this.search.bind(this, 'query')}
          />
          <i id="searchIcon" className={`material-icons ${styles.searchIcon}`} onClick={ this.clearSearch.bind(this) }>
            {this.state.searchIcon}
          </i>
        </div>
        <div className={styles.actionBar}>
          <IconMenu theme={theme} icon={button} position='topLeft'
            iconRipple={false} className='my-votes-button'>
            {this.props.votedDelegates.map(delegate =>
              <MenuItem
                theme={styles}
                key={delegate.username}
                caption={delegate.username}
                icon="close"
                onClick={this.props.addToUnvoted.bind(this, delegate)} />)}
          </IconMenu>
          <Button icon='done' flat
            className='vote-button'
            onClick={() => this.props.setActiveDialog({
              title: 'Vote for delegates',
              childComponent: VoteDialog,
              childComponentProps: {
                addTransaction: this.props.addTransaction,
                voted: this.props.votedDelegates,
              },
            })}
            label={this.confirmVoteText()} />
        </div>
      </header>
    );
  }
}
export default VotingHeader;
