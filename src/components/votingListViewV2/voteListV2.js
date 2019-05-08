import React from 'react';
import VoteRowV2 from './voteRowV2';

class VoteListV2 extends React.Component {
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
        <VoteRowV2 key={item} data={votes[item]}
          className={safari}
          username={item}/>
      ));
  }
}

export default VoteListV2;
