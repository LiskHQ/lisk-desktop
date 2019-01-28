import React from 'react';
import Button from 'react-toolbox/lib/button';

import ToolBoxInput from '../toolbox/inputs/toolBoxInput';

class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFilters: false,
      filters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: 0,
        amountTo: 0,
        message: '',
      },
    };
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  changeFilters(name, value) {
    this.setState({ filters: { ...this.state.filters, [name]: value } });
  }

  saveFilters() {
    this.props.saveFilters(this.state.filters);
    this.setState({ showFilters: false });
  }

  render() {
    return (
      <div>
        <div onClick={() => this.toggleFilters()}>FILTER</div>
          {this.state.showFilters ?
            <div>
              <div>
                <ToolBoxInput
                  type='text'
                  id='filter-date-from'
                  name='dateFrom'
                  placeholder='00-00-0000'
                  value={this.state.filters.dateFrom}
                  onChange={(val) => { this.changeFilters('dateFrom', val); }}/> -
                <ToolBoxInput
                  type='text'
                  id='filter-date-to'
                  name='dateTo'
                  placeholder='00-00-0000'
                  value={this.state.filters.dateTo}
                  onChange={(val) => { this.changeFilters('dateTo', val); }}/>
              </div>
              <div>
                <ToolBoxInput
                  type='text'
                  id='filter-date-from'
                  name='amountFrom'
                  value={this.state.filters.amountFrom}
                  onChange={(val) => { this.changeFilters('amountFrom', val); }}/> -

                <ToolBoxInput
                  type='text'
                  id='filter-date-to'
                  name='amountTo'
                  value={this.state.filters.amountTo}
                  onChange={(val) => { this.changeFilters('amountTo', val); }}/>
                <Button onClick={this.saveFilters.bind(this)}>Apply Filters</Button>
              </div>
            </div>
            : null}
      </div>);
  }
}

export default FilterButton;
