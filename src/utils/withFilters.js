import React from 'react';
import transactionTypes from 'constants';

function withFilters(apiName, initialFilters, initialSort) {
  return function (ChildComponent) {
    class FilterContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          filters: initialFilters,
          sort: initialSort,
        };
        this.actions = {
          applyFilters: this.applyFilters.bind(this),
          clearFilter: this.clearFilter.bind(this),
          clearAllFilters: this.applyFilters.bind(this, initialFilters),
          changeSort: this.changeSort.bind(this),
        };
      }

      applyFilters(f) {
        const { sort } = this.state;
        const filters = { ...f, sort };
        this.setState({ filters: f });
        this.props[apiName].loadData(Object.keys(filters).reduce((acc, key) => ({
          ...acc,
          ...(filters[key] && { [key]: key === 'type' ? transactionTypes.getByCode(Number(filters[key])).outgoingCode : filters[key] }),
        }), {}));
      }

      clearFilter(name) {
        this.applyFilters({
          ...this.state.filters,
          [name]: initialFilters[name],
        });
      }

      changeSort(id) {
        const { filters, sort } = this.state;
        this.setState({
          sort: `${id}:${sort.includes('asc') ? 'desc' : 'asc'}`,
        }, () => {
          this.applyFilters(filters);
        });
      }

      render() {
        return (
          <ChildComponent {...{
            ...this.props,
            ...this.state,
            ...this.actions,
          }}
          />
        );
      }
    }

    return FilterContainer;
  };
}

export default withFilters;
