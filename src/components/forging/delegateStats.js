import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import CircularProgressbar from 'react-circular-progressbar';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
import style from './forging.css';

const identity = x => (x);

const progressCircleCardList = [
  {
    key: 'rate',
    label: 'Rank',
    textForPercentage: percentage => (101 - percentage),
    percentageTransform: percentage => (101 - percentage),
  }, {
    key: 'productivity',
    label: 'Productivity',
    percentageTransform: identity,
  }, {
    key: 'approval',
    label: 'Approval',
    percentageTransform: identity,
  },
];

const DelegateStats = props => (
  <div className={`${grid.row} ${grid['between-xs']}`}>
    {progressCircleCardList.map(cardItem => (
      <div className={grid['col-xs-4']} key={cardItem.key}>
        <Card className={style.grayCard}>
          <CardText>
          <div className={grid['col-xs-12']}>
            <div className={`${grid.row}  ${grid['between-xs']}`}>
              <div className={style.circularProgressTitle}> {cardItem.label} </div>
              <CircularProgressbar
                percentage={cardItem.percentageTransform(props.delegate[cardItem.key])}
                textForPercentage={cardItem.textForPercentage}/>
            </div>
          </div>
          </CardText>
        </Card>
      </div>
    ))}
  </div>
);

export default DelegateStats;
