import React from 'react';
import { Card, CardText } from 'react-toolbox/lib/card';
import CircularProgressbar from 'react-circular-progressbar';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import style from './forging.css';

const identity = x => (x);
const addPercentSign = x => (`${x}%`);

const progressCircleCardList = [
  {
    key: 'rate',
    label: 'Rank',
    percentageTransform: percentage => (Math.max(0, 101 - percentage)),
    textForPercentage: identity,
  }, {
    key: 'productivity',
    label: 'Productivity',
    percentageTransform: identity,
    textForPercentage: addPercentSign,
  }, {
    key: 'approval',
    label: 'Approval',
    percentageTransform: identity,
    textForPercentage: addPercentSign,
  },
];

const DelegateStats = props => (
  <div className={`${grid.row} ${grid['between-xs']}`}>
    {progressCircleCardList.map(cardItem => (
      <div className={`${grid['col-xs-12']} ${grid['col-sm-4']}`} key={cardItem.key}>
        <Card className={style.grayCard}>
          <CardText>
            <div className={grid['col-xs-12']}>
              <div className={`${grid.row}  ${grid['between-xs']}`}>
                <div className={style.circularProgressTitle}> {cardItem.label} </div>
                <CircularProgressbar
                  percentage={cardItem.percentageTransform(props.delegate[cardItem.key])}
                  textForPercentage={
                    cardItem.textForPercentage.bind(null, props.delegate[cardItem.key])}/>
              </div>
            </div>
          </CardText>
        </Card>
      </div>
    ))}
  </div>
);

export default DelegateStats;
