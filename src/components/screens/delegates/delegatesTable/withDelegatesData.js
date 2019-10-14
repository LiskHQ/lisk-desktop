import React from 'react';
import voteFilters from '../../../../constants/voteFilters';

function withDelegatesData() {
  return function (ChildComponent) {
    class DelegatesContainer extends React.Component {
      constructor(props) {
        super(props);
        if (props.delegates.length === 0) {
          this.loadDelegates('');
        }
        this.state = {
          isLoading: false,
          filters: {
            tab: voteFilters.all,
            search: '',
          },
        };

        this.loadDelegates = this.loadDelegates.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
      }

      getDelegatesData() {
        return this.props.delegates.map(d => ({
          ...d,
          vote: this.props.votes[d.address],
        }));
      }

      loadDelegates(q = '', offset = 0) {
        this.setState({ isLoading: true });

        this.props.loadDelegates({
          offset,
          q,
          refresh: offset === 0,
          callback: () => {
            if (this.state.isLoading) {
              this.setState({ isLoading: false });
            }
          },
        });
      }

      applyFilters(filters) {
        this.setState({ filters });
      }

      render() {
        return (
          <ChildComponent {...{
            ...this.props,
            delegates: {
              data: this.getDelegatesData(),
              loadData: this.loadDelegates,
              isLoading: this.state.isLoading,
            },
            applyFilters: this.applyFilters,
            filters: this.state.filters,
          }}
          />
        );
      }
    }

    return DelegatesContainer;
  };
}

export default withDelegatesData;
