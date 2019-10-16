import React from 'react';
import { getPendingVotesList } from '../../../../utils/voting';
import voteFilters from '../../../../constants/voteFilters';

function withDelegatesData() {
  return function (ChildComponent) {
    class DelegatesContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          filters: {
            tab: voteFilters.all,
            search: '',
          },
        };

        this.loadDelegates = this.loadDelegates.bind(this);
        this.loadDelegatesFinished = this.loadDelegatesFinished.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
      }

      componentDidMount() {
        const { account, votes } = this.props;
        if (account.serverPublicKey && getPendingVotesList(votes).length === 0) {
          this.props.loadVotes({
            address: account.address,
          });
        }
        if (this.props.delegates.length === 0) {
          this.loadDelegates({});
        }
      }

      getDelegatesData() {
        const tabFilters = {
          [voteFilters.all]: () => true,
          [voteFilters.voted]: ({ voteStatus }) => voteStatus && voteStatus.confirmed,
          [voteFilters.notVoted]: ({ voteStatus }) => !voteStatus || !voteStatus.confirmed,
        };
        return this.props.delegates.map(d => ({
          ...d,
          voteStatus: this.props.votes[d.username],
        })).filter(tabFilters[this.state.filters.tab]);
      }

      loadDelegates({ q = '', offset = 0 }) {
        this.setState({ isLoading: true }, () => {
          this.props.loadDelegates({
            offset,
            q,
            refresh: offset === 0,
            callback: this.loadDelegatesFinished,
          });
        });
      }

      loadDelegatesFinished() {
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      }

      applyFilters(filters) {
        this.setState({
          filters: {
            ...this.state.filters,
            ...filters,
          },
        }, () => {
          this.loadDelegates({ q: this.state.filters.search });
        });
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
