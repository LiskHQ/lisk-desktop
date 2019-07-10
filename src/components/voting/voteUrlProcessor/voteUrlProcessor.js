import React from 'react';
import { filterObjectPropsWithValue } from '../../../utils/helpers';
import { getDelegateByName } from '../../../utils/api/delegates';
import { getVote } from '../../../utils/voting';
import { parseSearchParams } from '../../../utils/searchParams';
import VoteList from '../voteList';

export default class VoteUrlProcessor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      voteLookupStatus: { },
    };
  }

  componentDidMount() {
    let params = parseSearchParams(this.props.history.location.search);
    if (params.votes || params.unvotes) {
      this.setVotesFromParams(params);
    }

    this.unlisten = this.props.history.listen((location) => {
      params = parseSearchParams(location.search);
      this.setVotesFromParams(params);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  setVoteLookupStatus(name, status) {
    const { voteLookupStatus } = this.state;
    this.setState({
      voteLookupStatus: {
        ...voteLookupStatus,
        [name]: status,
      },
    });
  }

  processUrlVotes({ upvotes, unvotes, votes }) {
    const liskAPIClient = this.props.liskAPIClient;

    this.setState({
      voteLookupStatus: [...upvotes, ...unvotes].reduce((accumulator, vote) => {
        accumulator[vote] = 'pending';
        return accumulator;
      }, {}),
    });

    unvotes.forEach((name) => {
      if (getVote(votes, name)) {
        this.setVoteLookupStatus(name, 'downvote');
        this.props.voteToggled(getVote(votes, name));
      } else {
        getDelegateByName(liskAPIClient, name).then(() => {
          this.setVoteLookupStatus(name, 'nothingToChange');
        }).catch(() => {
          this.setVoteLookupStatus(name, 'notFound');
        });
      }
    });

    upvotes.forEach((name) => {
      getDelegateByName(liskAPIClient, name).then((delegate) => {
        if (!getVote(votes, name)) {
          this.setVoteLookupStatus(name, 'upvote');
          this.props.voteToggled({
            ...delegate,
            publicKey: delegate.account.publicKey,
            address: delegate.account.address,
          });
        } else {
          this.setVoteLookupStatus(name, 'nothingToChange');
        }
      }).catch(() => {
        this.setVoteLookupStatus(name, 'notFound');
      });
    });
  }

  setVotesFromParams(params) {
    const upvotes = params.votes ? params.votes.split(',') : [];
    const unvotes = params.unvotes ? params.unvotes.split(',') : [];
    if (upvotes.length + unvotes.length) {
      this.props.loadVotes({
        address: this.props.account.address,
        callback: (votes) => {
          this.processUrlVotes({
            upvotes,
            unvotes,
            votes,
          });
        },
      });
    }
  }

  render() {
    const { t, votes } = this.props;
    const sections = {
      pending: t('Processing...'),
      notFound: t('Check spelling – delegate name does not exist'),
      nothingToChange: t('Nothing to change – already voted/unvoted'),
    };
    const voteLookupStatus = {
      pending: filterObjectPropsWithValue(this.state.voteLookupStatus, 'pending'),
      nothingToChange: filterObjectPropsWithValue(this.state.voteLookupStatus, 'nothingToChange'),
      notFound: filterObjectPropsWithValue(this.state.voteLookupStatus, 'notFound'),
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
