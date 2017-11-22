import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import Input from 'react-toolbox/lib/input';
import { translate } from 'react-i18next';
import styles from './voting.css';
import disableStyle from './disableMenu.css';
import RelativeLink from '../relativeLink';

export class VotingHeaderRaw extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      searchIcon: 'search',
      votesList: [],
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
    let info = this.props.t('Vote', { context: 'verb' });
    const { votes } = this.props;
    const votesList = Object.keys(votes);
    const voted = votesList.filter(item =>
      !votes[item].confirmed && votes[item].unconfirmed).length;
    const unvoted = votesList.filter(item =>
      votes[item].confirmed && !votes[item].unconfirmed).length;
    if (voted > 0 || unvoted > 0) {
      const separator = (voted > 0 && unvoted > 0) ? ' / ' : ''; // eslint-disable-line
      const votedHtml = voted > 0 ? <span className={styles.voted}>+{voted}</span> : '';
      const unvotedHtml = unvoted > 0 ? <span className={styles.unvoted}>-{unvoted}</span> : '';
      info = <span className='vote-button-info'>{this.props.t('Vote', { context: 'verb' })} ({votedHtml}{separator}{unvotedHtml})</span>;
    }
    return info;
  }

  render() {
    const { votes, t } = this.props;
    const votesList = Object.keys(votes);
    const confirmedVotes = Object.keys(votes).filter(username => votes[username].confirmed);
    const theme = votesList.length === 0 ? disableStyle : styles;
    const button = <div className={styles.votesMenuButton}>
      <i className='material-icons'>visibility</i>
      <span>{t('my votes')} ({confirmedVotes.length})</span>
    </div>;
    return (
      <header className={`${grid.row} ${grid['between-xs']} hasPaddingRow`}>
        <div className={`${grid['col-xs-3']} ${styles.searchBox}`}>
          <Input type='tel'
            label={t('Search')}
            name='query'
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
            {confirmedVotes.map(username =>
              <MenuItem
                theme={styles}
                key={username}
                caption={username}
                icon={(votes[username].confirmed === votes[username].unconfirmed) ? 'clear' : 'add'}
                onClick={this.props.voteToggled.bind(this, {
                  username,
                  publicKey: votes[username].publicKey,
                })} />)}
          </IconMenu>
          <RelativeLink flat primary className={`${styles.voteButton} vote-button`}
            to='vote'>{this.confirmVoteText()}</RelativeLink>
        </div>
      </header>
    );
  }
}
export default translate()(VotingHeaderRaw);
