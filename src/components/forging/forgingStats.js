import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import moment from 'moment';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import LiskAmount from '../liskAmount';
import style from './forging.css';

const statCardObjects = [
  {
    key: 'last24h',
    days: 1,
  }, {
    key: 'last7d',
    days: 7,
  }, {
    key: 'last30d',
    days: 30,
  }, {
    key: 'last365d',
    days: 365,
  },
];

class ForgingStats extends React.Component {
  componentDidMount() {
    statCardObjects.map(obj => this.props.loadStats(obj.key, moment().subtract(obj.days, 'days')));
  }

  render() {
    statCardObjects[0].label = this.props.t('Last 24 hours');
    [1, 2, 3].forEach((i) => {
      statCardObjects[i].label = this.props.t('Last {{count}} days',
        { count: statCardObjects[i].days });
    });

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
                        roundTo={2} /> LSK
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

export default translate()(ForgingStats);
