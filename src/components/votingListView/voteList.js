import React from 'react';
import VoteRow from './voteRow';

class VoteList extends React.Component {
  componentWillUpdate(nextProps) {
    // istanbul ignore else
    if (this.props.showChangeSummery === true && nextProps.showChangeSummery === false) {
      this.props.prevStep();
    }
  }

  render() {
    const { votes, safari } = this.props;
    return Object.keys(votes)
      .filter(item => votes[item].confirmed !== votes[item].unconfirmed)
      .map(item => (
        <VoteRow key={item} data={votes[item]}
          className={safari}
          username={item}/>
      ));
  }
}

export default VoteList;
