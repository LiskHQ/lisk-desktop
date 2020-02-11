import React from 'react';
import { filterObjectPropsWithValue } from '../../../../../utils/helpers';
import { getDelegateByName } from '../../../../../utils/api/delegates';
import { getVote } from '../../../../../utils/voting';
import { parseSearchParams } from '../../../../../utils/searchParams';
import VoteList from '../voteList';

export default class VoteUrlProcessor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      voteLookupStatus: { },
      pendingVotes: [],
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

  setVoteLookupStatus(name, status, vote) {
    const { voteLookupStatus, pendingVotes } = this.state;
    this.setState({
      voteLookupStatus: {
        ...voteLookupStatus,
        [name]: status,
      },
      pendingVotes: [
        ...pendingVotes,
        ...(vote ? [vote] : []),
      ],
    });
  }

  componentDidUpdate() {
    if (filterObjectPropsWithValue(this.state.voteLookupStatus, 'pending').length === 0
        && this.state.pendingVotes.length > 0) {
      this.state.pendingVotes.forEach(v => this.props.voteToggled({
        account: {
          address: v.address,
          publicKey: v.publicKey,
        },
        username: v.username,
        rank: v.rank,
      }));
      this.setState({
        pendingVotes: [],
      });
    }
  }

  getDelegateByName(name) {
    return new Promise((resolve, reject) => {
      const { liskAPIClient, delegates } = this.props;
      const delegate = getVote(delegates, name);
      if (delegate) {
        resolve(delegate);
      } else {
        getDelegateByName(liskAPIClient, name).then(resolve).catch(reject);
      }
    });
  }

  processUrlVotes({ upvotes, unvotes, votes }) {
    unvotes.forEach((name) => {
      if (getVote(votes, name)) {
        this.setVoteLookupStatus(name, 'downvote', getVote(votes, name));
      } else {
        this.getDelegateByName(name).then(() => {
          this.setVoteLookupStatus(name, 'alreadyVoted');
        }).catch(() => {
          this.setVoteLookupStatus(name, 'notFound');
        });
      }
    });

    upvotes.forEach((name) => {
      this.getDelegateByName(name).then((delegate) => {
        if (!getVote(votes, name)) {
          this.setVoteLookupStatus(name, 'upvote', {
            ...delegate,
            publicKey: delegate.account.publicKey,
            address: delegate.account.address,
          });
        } else {
          this.setVoteLookupStatus(name, 'alreadyVoted');
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
      this.setState({
        voteLookupStatus: [...upvotes, ...unvotes].reduce((accumulator, vote) => {
          accumulator[vote] = 'pending';
          return accumulator;
        }, {}),
        pendingVotes: [],
      });

      this.props.loadDelegates({
        callback: () => {
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
        },
      });
    }
  }

  render() {
    const { t, votes } = this.props;
    const voteLookupStatus = [{
      key: 'pending',
      title: t('Processing...'),
      list: filterObjectPropsWithValue(this.state.voteLookupStatus, 'pending'),
    }, {
      key: 'notFound',
      title: t('Check spelling – delegate name does not exist.'),
      list: filterObjectPropsWithValue(this.state.voteLookupStatus, 'notFound'),
    }, {
      key: 'alreadyVoted',
      title: t('Nothing to change – already voted/unvoted.'),
      list: filterObjectPropsWithValue(this.state.voteLookupStatus, 'alreadyVoted'),
    }];

    return (
      <React.Fragment>
        {voteLookupStatus.map(({ key, title, list }) => (
          list.length ? (
            <VoteList
              className={`${key}-message`}
              title={title}
              list={list}
              votes={votes}
              key={key}
            />
          ) : null
        ))}
      </React.Fragment>
    );
  }
}
