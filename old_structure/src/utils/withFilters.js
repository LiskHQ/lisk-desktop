import React from 'react';

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

      applyFilters(f, api = apiName) {
        const { sort } = this.state;
        const filters = { ...f, sort };
        this.setState({ filters: f });
        const usedFilters = Object.keys(filters).filter(key => filters[key] !== '').reduce((acc, key) => { acc[key] = filters[key]; return acc; }, {});
        this.props[api].loadData(usedFilters);
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
