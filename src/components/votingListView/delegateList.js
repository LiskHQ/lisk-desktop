import React, { Fragment } from 'react';
import Waypoint from 'react-waypoint';
import DelegateRow from './delegateRow';

class DelegateList extends React.Component {
  constructor() {
    super();
    this.state = { didMount: false };
  }

  componentWillUpdate(nextProps) {
    if (this.props.showChangeSummery === false && nextProps.showChangeSummery === true) {
      this.props.nextStep();
    }
  }

  componentDidMount() {
    this.setState({ didMount: true });
  }

  render() {
    return (<Fragment>
      {
        this.state.didMount ?
          this.props.list.map(item =>
            <DelegateRow key={item.account.address} data={item}
              className={this.props.safari}
              voteToggled={this.props.voteToggled}
              voteStatus={this.props.votes[item.username]}
            />) : null
      }
      <Waypoint bottomOffset='-80%'
        key={this.props.list.length}
        onEnter={this.props.loadMore}></Waypoint>
    </Fragment>);
  }
}

export default DelegateList;
