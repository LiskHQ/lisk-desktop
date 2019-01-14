/* eslint-disable */
import React from 'react';
import { PrimaryButton } from './../toolbox/buttons/button';
import Box from '../box';
import { parseSearchParams } from '../../utils/searchParams';
import routes from '../../constants/routes';
import { FontIcon } from '../fontIcon';
import Piwik from '../../utils/piwik';
import styles from './voteUrlProcessor.css';

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
    this.props.clearVoteLookupStatus();
    const params = parseSearchParams(this.props.history.location.search);
    if (params.votes || params.unvotes) {
      this.setVotesFromParams(params);
    }

    this.props.history.listen(location =>  {
      /* istanbul ignore if */
      if (location.pathname === routes.delegates.path) {
        const params = parseSearchParams(location.search);

        if (location.search && location.search !== this.state.params) {
          this.props.clearVoteLookupStatus();
          this.setVotesFromParams(params);
          this.setState({
            params: location.search,
          })
        }
      }
    });
  }

  setVotesFromParams(params) {
    const upvotes = params.votes ? params.votes.split(',') : [];
    const unvotes = params.unvotes ? params.unvotes.split(',') : [];
    this.props.settingsUpdated({ advancedMode: true })
    this.props.toggleShowInfo(true);
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

  getProcessedCount() {
    return this.props.urlVoteCount - this.props.pending.length;
  }

  onClearVotes() {
    Piwik.trackingEvent('VoteUrlProcessor', 'button', 'Clear Votes');
    this.props.clearVoteLookupStatus();
    this.props.clearVotes();
    this.props.toggleShowInfo(false);
    this.props.history.push(routes.delegates.path);
  }

  onCloseInfo() {
    Piwik.trackingEvent('VoteUrlProcessor', 'button', 'Close info');
    this.props.toggleShowInfo(false);
    this.props.history.push(routes.delegates.path);
  }

  render() {
    const errorMessages = {
      notFound: {
        text: this.props.t('Check spelling – name does not exist on mainnet'),
        icon: 'warning',
      },
      alreadyVoted: {
        text: this.props.t('Nothing to change – already voted/unvoted'),
        icon: 'checkmark-circled',
      },
    };

    const successMessages = {
      upvotes: {
        text: this.props.t('{{count}} delegate(s) selected to vote', { count: this.props.upvotes.length }),
        icon: 'add-circled',
      },
      unvotes: {
        text: this.props.t('{{count}} delegate(s) selected to unvote', { count: this.props.unvotes.length }),
        icon: 'remove-circled',
      },
    };

    return this.props.show ?
      <Box className={styles.noShadow}>
        <section className={styles.wrapper}>
          <header>
              <h2>Your Pre-Selection
                <div className={`${styles.cancel} clear-votes`} onClick={() => this.onClearVotes()}>
                  {this.props.t('Cancel')}
                  <FontIcon value='close' />
                </div>
              </h2>
          </header>
          <div className={styles.selectedVotes}>
            <div>{Object.keys(errorMessages).map((list, key) => (
              this.props[list].length ? (
                <div key={key} className={`${styles.block} ${list}-message`}>
                  <div className={`${styles.title}`}>
                    <FontIcon className={styles[list]}
                      value={errorMessages[list].icon} /> {errorMessages[list].text}
                  </div>
                  <div className={styles.votes}>{this.props[list].join(', ')}</div>
                </div>
              ) : null
            ))}
            {Object.keys(successMessages).map((list, key) => {
              return this.props[list].length ? (
                <div key={key} className={styles.block}>
                  <div className={`${styles.title}`}>
                    <FontIcon className={styles[list]}
                      value={successMessages[list].icon} /> {successMessages[list].text}
                  </div>
                  <div className={`${list}-message ${styles.votes}`}>{this.props[list].join(', ')}</div>
                </div>
              ) : null }
            )}</div>
          </div>
          <footer>
            <PrimaryButton className={'ok-close-info'} label={this.props.t('Ok')} theme={styles} onClick={this.onCloseInfo.bind(this)}/>
          </footer>
        </section>
      </Box> : null;
  }
}
