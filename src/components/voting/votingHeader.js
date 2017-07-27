import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Input from 'react-toolbox/lib/input';
import styles from './voting.css';

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
  render() {
    return (
      <header className={`${grid.row} hasPaddingRow`}>
        <div className={`${grid['col-xs-3']} ${styles.searchBox}`}>
          <Input type='tel' label='Search' name='query'
            value={this.state.query}
            onChange={this.search.bind(this, 'query')}
          />
          <i className={`material-icons ${styles.searchIcon}`} onClick={ this.clearSearch.bind(this) }>
            {this.state.searchIcon}
          </i>
        </div>
      </header>
    );
  }
}
export default VotingHeader;
