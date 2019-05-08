import React, { Fragment } from 'react';
import Waypoint from 'react-waypoint';
import DelegateRowV2 from './delegateRowV2';

class DelegateListV2 extends React.Component {
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
            <DelegateRowV2 key={item.account.address} data={item}
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

export default DelegateListV2;
