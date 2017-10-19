import { Card } from 'react-toolbox/lib/card';
import { List, ListItem } from 'react-toolbox/lib/list';
import { translate } from 'react-i18next';
import Chip from 'react-toolbox/lib/chip';
import Input from 'react-toolbox/lib/input';
import React from 'react';

import { voteAutocomplete, unvoteAutocomplete } from '../../utils/api/delegate';
import styles from './voteAutocomplete.css';

export class VoteAutocompleteRaw extends React.Component {
  constructor() {
    super();
    this.state = {
      votedSuggestionClass: styles.hidden,
      unvotedSuggestionClass: styles.hidden,
      votedResult: [],
      unvotedResult: [],
      votedListSearch: '',
      unvotedListSearch: '',
      votedSuggestionError: '',
      unvotedSuggestionError: '',

    };
  }

  suggestionStatus(value, name) {
    const className = value ? '' : styles.hidden;
    setTimeout(() => {
      this.setState({ [name]: className });
    }, 200);
  }
  /**
   * Update state and call a suitable api to create a list of suggestion
   *
   * @param {*} name  - name of input in react state
   * @param {*} value - value that we want save it in react state
   */
  search(name, value) {
    this.setState({ ...this.state, [name]: value });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value.length > 0) {
        if (name === 'votedListSearch') {
          voteAutocomplete(this.props.activePeer, value, this.props.votes)
            .then((res) => {
              if (res.length > 0) {
                this.setState({
                  votedResult: res,
                  votedSuggestionClass: '',
                  votedSuggestionError: '',
                });
              } else {
                this.setState({
                  votedSuggestionError: this.props.t('No matches'),
                  votedSuggestionClass: styles.hidden,
                });
              }
            });
        } else {
          unvoteAutocomplete(value, this.props.votes)
            .then((res) => {
              if (res.length > 0) {
                this.setState({
                  unvotedResult: res,
                  unvotedSuggestionClass: '',
                  unvotedSuggestionError: '',
                });
              } else {
                this.setState({
                  unvotedSuggestionError: this.props.t('No matches'),
                  unvotedSuggestionClass: styles.hidden,
                });
              }
            });
        }
      } else {
        this.setState({
          votedResult: [],
          unvotedResult: [],
          votedSuggestionError: '',
          unvotedSuggestionError: '',
          votedSuggestionClass: styles.hidden,
          unvotedSuggestionClass: styles.hidden,
        });
      }
    }, 250);
  }
  votedSearchKeyDown(event) {
    this.keyPress(event, 'votedSuggestionClass', 'votedResult');
  }
  unvotedSearchKeyDown(event) {
    this.keyPress(event, 'unvotedSuggestionClass', 'unvotedResult');
  }
  /**
   * handle key down event on autocomplete inputs
   *
   * @param {object} event - event of javascript
   * @param {*} className - class name of suggestion box
   * @param {*} listName - name of the list that we want to use as a suggestion list
   */
  keyPress(event, className, listName) {
    const selectFunc = listName === 'votedResult' ? 'addToVoted' : 'removeFromVoted';
    const selected = this.state[listName].filter(d => d.hovered);
    switch (event.keyCode) {
      case 40: // 40 is keyCode of arrow down key in keyboard
        this.handleArrowDown(this.state[listName], listName);
        return false;
      case 38: // 38 is keyCode of arrow up key in keyboard
        this.handleArrowUp(this.state[listName], listName);
        return false;
      case 27 : // 27 is keyCode of escape key in keyboard
        this.setState({
          [className]: styles.hidden,
        });
        return false;
      case 13 : // 13 is keyCode of enter key in keyboard
        if (selected.length > 0) {
          selected[0].hovered = false;
          this.setState({
            [listName]: this.state[listName],
          });
          this[selectFunc](selected[0]);
        }
        return false;
      default:
        break;
    }
    return true;
  }
  /**
   * move to the next item when arrow down is pressed
   *
   * @param {*} list - suggested list
   * @param {*} className - name of the list that we want to use as a suggestion list in react state
   */
  handleArrowDown(list, name) {
    const selected = list.filter(d => d.hovered);
    const index = list.indexOf(selected[0]);
    if (selected.length > 0 && list[index + 1]) {
      list[index].hovered = false;
      list[index + 1].hovered = true;
      // document.getElementById('votedResult').scrollTop = 56
    } else if (list[index + 1]) {
      list[0].hovered = true;
    }
    this.setState({ [name]: list });
  }

  /**
   * move to the next item when up down is pressed
   *
   * @param {*} list - suggested list
   * @param {*} className - name of the list that we want to use as a suggestion list in react state
   */
  handleArrowUp(list, name) {
    const selected = list.filter(d => d.hovered);
    const index = list.indexOf(selected[0]);
    if (index - 1 > -1) {
      list[index].hovered = false;
      list[index - 1].hovered = true;
    }
    this.setState({ [name]: list });
  }
  addToVoted(item) {
    const { username, publicKey } = item;
    this.props.voteToggled({ username, publicKey });
    this.setState({
      votedListSearch: '',
      votedSuggestionClass: styles.hidden,
    });
  }
  removeFromVoted(item) {
    const { username, publicKey } = item;
    this.props.voteToggled({ username, publicKey });
    this.setState({
      unvotedListSearch: '',
      unvotedSuggestionClass: styles.hidden,
    });
  }

  render() {
    const { votes } = this.props;
    const votedList = [];
    const unvotedList = [];

    Object.keys(votes).forEach((delegate) => {
      if (!votes[delegate].confirmed && votes[delegate].unconfirmed) {
        votedList.push(delegate);
      } else if (votes[delegate].confirmed && !votes[delegate].unconfirmed) {
        unvotedList.push(delegate);
      }
    });


    return (
      <article>
        <h3 className={styles.autoCompleteTile}>{this.props.t('Add vote to')}</h3>
        <div className='vote-list'>
          {votedList.map(
            item => <Chip key={item}
              deletable
              onDeleteClick={this.props.voteToggled.bind(this,
                { username: item, publicKey: votes[item].publicKey })}>
              {item}
            </Chip>,
          )}
        </div>
        <section className={styles.searchContainer}>
          <Input type='text' label={this.props.t('Search by username')} name='votedListSearch'
            className='votedListSearch' value={this.state.votedListSearch}
            error={this.state.votedSuggestionError}
            theme={styles}
            onBlur={this.suggestionStatus.bind(this, false, 'votedSuggestionClass')}
            onKeyDown={this.votedSearchKeyDown.bind(this)}
            onChange={this.search.bind(this, 'votedListSearch')}
            autoComplete='off'/>
          <Card id='votedResult' className={`${styles.searchResult} ${this.state.votedSuggestionClass}`}>
            <List>
              {this.state.votedResult.map(
                item => <ListItem
                  key={item.username}
                  caption={item.username}
                  selectable={true}
                  selected={true}
                  className={item.hovered ? styles.selectedRow : ''}
                  onClick={this.addToVoted.bind(this, item)} />,
              )}
            </List>
          </Card>
        </section>
        <h3 className={styles.autoCompleteTile}>{this.props.t('Remove vote from')}</h3>
        <div className='unvote-list'>
          {unvotedList.map(
            item => <Chip key={item}
              deletable
              onDeleteClick={this.props.voteToggled.bind(this,
                { username: item, publicKey: votes[item].publicKey })}>
              {item}
            </Chip>,
          )}
        </div>
        <section className={styles.searchContainer}>
          <Input type='text' label={this.props.t('Search by username')} name='unvotedListSearch'
            className='unvotedListSearch' value={this.state.unvotedListSearch}
            error={this.state.unvotedSuggestionError}
            theme={styles}
            onBlur={this.suggestionStatus.bind(this, false, 'unvotedSuggestionClass')}
            onKeyDown={this.unvotedSearchKeyDown.bind(this)}
            onChange={this.search.bind(this, 'unvotedListSearch')}
            autoComplete='off'/>
          <Card id='unvotedResult' className={`${styles.searchResult} ${this.state.unvotedSuggestionClass}`}>
            <List>
              {this.state.unvotedResult.map(
                item => <ListItem
                  key={item.username}
                  caption={item.username}
                  selectable={true}
                  selected={true}
                  className={item.hovered ? styles.selectedRow : ''}
                  onClick={this.removeFromVoted.bind(this, item)} />,
              )}
            </List>
          </Card>
        </section>
      </article>
    );
  }
}

export default translate()(VoteAutocompleteRaw);
