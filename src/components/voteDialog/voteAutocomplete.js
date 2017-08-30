import React from 'react';
import Input from 'react-toolbox/lib/input';
import Chip from 'react-toolbox/lib/chip';
import { Card } from 'react-toolbox/lib/card';
import { List, ListItem } from 'react-toolbox/lib/list';
import { voteAutocomplete, unvoteAutocomplete } from '../../utils/api/delegate';
import styles from './voteAutocomplete.css';

export default class VoteAutocomplete extends React.Component {
  constructor() {
    super();
    this.state = {
      votedSuggestionClass: styles.hidden,
      unvotedSuggestionClass: styles.hidden,
      votedResult: [],
      unvotedResult: [],
      votedListSearch: '',
      unvotedListSearch: '',
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
          voteAutocomplete(this.props.activePeer, value, this.props.voted)
            .then((res) => {
              this.setState({
                votedResult: res,
                votedSuggestionClass: '',
              });
            });
        } else {
          unvoteAutocomplete(value, this.props.voted)
            .then((res) => {
              this.setState({
                unvotedResult: res,
                unvotedSuggestionClass: '',
              });
            });
        }
      } else {
        this.setState({
          votedResult: [],
          unvotedResult: [],
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
      case 27 : // 27 is keyCode of enter key in keyboard
        this.setState({
          [className]: styles.hidden,
        });
        return false;
      case 13 : // 27 is keyCode of escape key in keyboard
        if (selected.length > 0) {
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
    this.props.addedToVoteList(item);
    this.setState({
      votedListSearch: '',
      votedSuggestionClass: styles.hidden,
    });
  }
  removeFromVoted(item) {
    this.props.removedFromVoteList(item);
    this.setState({
      unvotedListSearch: '',
      unvotedSuggestionClass: styles.hidden,
    });
  }

  render() {
    return (
      <article>
        <h3 className={styles.autoCompleteTile}>Add vote to</h3>
        <div>
          {this.props.votedList.map(
            item => <Chip key={item.username}
              deletable
              onDeleteClick={this.props.removedFromVoteList.bind(this, item)}>
                {item.username}
              </Chip>,
          )}
        </div>
        <section className={styles.searchContainer}>
          <Input type='text' label='Search by username' name='votedListSearch'
            className='votedListSearch' value={this.state.votedListSearch}
            theme={styles}
            onBlur={this.suggestionStatus.bind(this, false, 'votedSuggestionClass')}
            onKeyDown={this.votedSearchKeyDown.bind(this)}
            onChange={this.search.bind(this, 'votedListSearch')}/>
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
        <h3 className={styles.autoCompleteTile}>Remove vote from</h3>
        <div>
          {this.props.unvotedList.map(
            item => <Chip key={item.username}
              deletable
              onDeleteClick={this.props.addedToVoteList.bind(this, item)}>
                {item.username}
              </Chip>,
          )}
        </div>
        <section className={styles.searchContainer}>
          <Input type='text' label='Search by username' name='unvotedListSearch'
            className='unvotedListSearch' value={this.state.unvotedListSearch}
            theme={styles}
            onBlur={this.suggestionStatus.bind(this, false, 'unvotedSuggestionClass')}
            onKeyDown={this.unvotedSearchKeyDown.bind(this)}
            onChange={this.search.bind(this, 'unvotedListSearch')}/>
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
