import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import CircularProgressbar from 'react-circular-progressbar';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
import style from './forging.css';

const progressCircleCardObjects = [
  {
    key: 'rate',
    label: 'Rank',
    textForPercentage: pct => (101 - pct),
    percentageTransform: pct => (101 - pct),
  }, {
    key: 'productivity',
    label: 'Productivity',
  }, {
    key: 'approval',
    label: 'Approval',
  },
];

const identity = x => (x);

const DelegateStats = props => (
  <div className={`${grid.row} ${grid['between-xs']}`}>
    {progressCircleCardObjects.map(cardObj => (
      <div className={grid['col-xs-4']} key={cardObj.key}>
        <Card className={style.grayCard}>
          <CardText>
          <div className={grid['col-xs-12']}>
            <div className={`${grid.row}  ${grid['between-xs']}`}>
              <div className={style.circularProgressTitle}> {cardObj.label} </div>
              <CircularProgressbar
                percentage={(cardObj.percentageTransform || identity)(props.delegate[cardObj.key])}
                textForPercentage={cardObj.textForPercentage}/>
            </div>
          </div>
          </CardText>
        </Card>
      </div>
    ))}
  </div>
);

export default DelegateStats;
