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
          clearAllFilters: this.clearAllFilters.bind(this),
          changeSort: this.changeSort.bind(this),
        };
      }

      applyFilters(f, api = apiName, cb) {
        const { sort } = this.state;
        const filters = { ...f, sort };
        this.setState({ filters: f });
        const usedFilters = Object.keys(filters)
          .filter((key) => filters[key] !== '')
          .reduce((acc, key) => {
            acc[key] = filters[key];
            return acc;
          }, {});
        if (cb) {
          cb(usedFilters);
        } else {
          this.props[api].loadData(usedFilters);
        }
      }

      clearFilter(name, cb) {
        if (cb) {
          this.setState({
            filters: {
              ...this.state.filters,
              [name]: initialFilters[name],
            },
          });
          cb();
        } else {
          this.applyFilters({
            ...this.state.filters,
            [name]: initialFilters[name],
          });
        }
      }

      clearAllFilters(callback) {
        if (callback) {
          this.setState({ filters: initialFilters });
          callback();
        } else {
          this.applyFilters(initialFilters);
        }
      }

      changeSort(id, callback) {
        const { filters, sort } = this.state;
        this.setState(
          {
            sort: `${id}:${sort.includes('asc') ? 'desc' : 'asc'}`,
          },
          () => {
            if (callback) {
              callback();
            } else {
              this.applyFilters(filters);
            }
          }
        );
      }

      render() {
        return (
          <ChildComponent
            {...{
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
