import React from 'react';

function withFilters(apiName, initialState) {
  return function (ChildComponent) {
    class FilterContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          filters: initialState,
        };
        this.applyFilters = this.applyFilters.bind(this);
        this.clearFilter = this.clearFilter.bind(this);
        this.clearAllFilters = this.applyFilters.bind(this, initialState);
      }

      applyFilters(f) {
        this.setState({ filters: f });
        this.props[apiName].clearData();
        this.props[apiName].loadData(Object.keys(f).reduce((acc, key) => ({
          ...acc,
          ...(f[key] && { [key]: f[key] }),
        }), {}));
      }

      clearFilter(name) {
        this.applyFilters({
          ...this.state.filters,
          [name]: initialState[name],
        });
      }

      render() {
        return (
          <ChildComponent {...{
            ...this.props,
            ...{
              filters: this.state.filters,
              applyFilters: this.applyFilters,
              clearFilter: this.clearFilter,
              clearAllFilters: this.clearAllFilters,
            },
          }}
          />
        );
      }
    }

    return FilterContainer;
  };
}

export default withFilters;
