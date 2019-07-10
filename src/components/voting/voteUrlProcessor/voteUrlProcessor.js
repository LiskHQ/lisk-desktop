import React from 'react';
import { parseSearchParams } from '../../../utils/searchParams';
import routes from '../../../constants/routes';
import VoteList from '../voteList';

export default class VoteUrlProcessor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: [],
      unvotes: [],
      params: '',
    };
  }

  componentDidMount() {
    this.props.voteLookupStatusCleared();
    let params = parseSearchParams(this.props.history.location.search);
    if (params.votes || params.unvotes) {
      this.setVotesFromParams(params);
    }

    this.props.history.listen((location) => {
      if (location.pathname === routes.voting.path) {
        params = parseSearchParams(location.search);

        if (location.search && location.search !== this.state.params) {
          this.props.voteLookupStatusCleared();
          this.setVotesFromParams(params);
          this.setState({
            params: location.search,
          });
        }
      }
    });
  }

  setVotesFromParams(params) {
    const upvotes = params.votes ? params.votes.split(',') : [];
    const unvotes = params.unvotes ? params.unvotes.split(',') : [];
    this.props.urlVotesFound({
      upvotes,
      unvotes,
      address: this.props.account.address,
    });

    this.setState({
      votes: params.votes,
      unvotes: params.unvotes,
    });
  }

  render() {
    const { t, voteLookupStatus, votes } = this.props;
    const sections = {
      pending: t('Processing...'),
      notFound: t('Check spelling – delegate name does not exist'),
      alreadyVoted: t('Nothing to change – already voted/unvoted'),
    };

    return (
      <React.Fragment>
        {Object.keys(sections).map((list, key) => (
          voteLookupStatus[list].length ? (
            <VoteList
              className={`${list}-message`}
              title={sections[list]}
              list={voteLookupStatus[list]}
              votes={votes}
              key={key}
            />
          ) : null
        ))}
      </React.Fragment>
    );
  }
}
