import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import moment from 'moment';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LiskAmount from '../liskAmount';
import style from './forging.css';


class ForgingTitle extends React.Component {

  componentDidMount() {
    this.props.loadStats('total', moment('2016-04-24 17:00'));
  }

  render() {
    return (
      <Card className={`${style.grayCard} ${grid['col-xs-12']}`}>
        <CardText>
          <div className={`${grid.row} ${grid['between-xs']}`}>
            <h2 className={`${style.delegateName} delegate-name`}>
              {this.props.account.delegate.username}
            </h2>
            <span>
              <LiskAmount val={this.props.statistics.total} roundTo={2} /> LSK Earned
            </span>
          </div>
        </CardText>
      </Card>
    );
  }
}

export default ForgingTitle;
