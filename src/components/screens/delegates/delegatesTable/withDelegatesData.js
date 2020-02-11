import React from 'react';
import voteFilters from '../../../../constants/voteFilters';

const withDelegatesData = () => (ChildComponent) => {
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
      this.tabFilters = {
        [voteFilters.all]: () => true,
        [voteFilters.voted]: ({ voteStatus }) => voteStatus && voteStatus.confirmed,
        [voteFilters.notVoted]: ({ voteStatus }) => !voteStatus || !voteStatus.confirmed,
      };
    }

    componentDidMount() {
      this.mounted = true;
      const { account: { serverPublicKey, address }, votes, loadVotes } = this.props;
      if (serverPublicKey && Object.keys(votes).length === 0) {
        loadVotes({ address });
      }
      this.loadDelegates({});
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    getDelegatesData() {
      const filteredDelegates = this.props.delegates.map(delegate => ({
        ...delegate,
        voteStatus: this.props.votes[delegate.username],
      })).filter(this.tabFilters[this.state.filters.tab]);

      if (filteredDelegates.length < Object.keys(this.props.votes).length
      && !this.isFillingDelegates) {
        this.isFillingDelegates = true;
        const offset = this.props.delegates.length;
        // this.props.delegates.loadData({ offset, limit: 101 });
        this.props.loadDelegates({
          offset,
          q: '',
          refresh: false,
          callback: () => {
            this.isFillingDelegates = false;
          },
        });
      }
      return filteredDelegates;
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
      if (this.state.isLoading && this.mounted) {
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

export default withDelegatesData;
