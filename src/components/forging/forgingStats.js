import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import moment from 'moment';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LiskAmount from '../liskAmount';
import style from './forging.css';

const statCardObjects = [
  {
    key: 'last24h',
    label: 'Last 24 hours',
    startMoment: moment().subtract(1, 'days'),
  }, {
    key: 'last7d',
    label: 'Last 7 days',
    startMoment: moment().subtract(7, 'days'),
  }, {
    key: 'last30d',
    label: 'Last 30 days',
    startMoment: moment().subtract(30, 'days'),
  }, {
    key: 'last365d',
    label: 'Last 365 days',
    startMoment: moment().subtract(365, 'days'),
  },
];


class ForgingStats extends React.Component {

  componentDidMount() {
    statCardObjects.map(obj => this.props.loadStats(obj.key, obj.startMoment));
  }

  render() {
    return (
      <div className={`${grid.row} ${grid['between-xs']}`}>
        {statCardObjects.map(cardObj => (
          <div className={`${grid['col-xs-12']} ${grid['col-sm-3']}`} key={cardObj.key}>
            <Card className={style.grayCard}>
              <CardText>
              <div className={grid['col-xs-12']}>
                <div className={`${grid.row}  ${grid['between-xs']}`}>
                  <span className='title'> {cardObj.label} </span>
                  <span>
                    <LiskAmount val={this.props.statistics[cardObj.key]}
                      roundTo={2}
                      /> LSK
                  </span>
                </div>
              </div>
              </CardText>
            </Card>
          </div>
        ))}
      </div>
    );
  }
}

export default ForgingStats;
