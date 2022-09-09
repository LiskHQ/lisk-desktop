import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Flag from '../flag';

const PeerRow = ({ data, className }) => (
  <div className={`${grid.row} ${className} peer-row`}>
    <span className={grid['col-xs-3']}>{data.ip}</span>
    <span className={grid['col-xs-2']}>{data.httpPort}</span>
    <span className={grid['col-xs-2']}>
      <Flag code={data.location?.countryCode} />
    </span>
    <span className={`${grid['col-xs-2']} network-span`}>{data.version}</span>
    <span className={grid['col-xs-3']}>{data.height}</span>
  </div>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  prevProps.data.ip === nextProps.data.ip && prevProps.data.height === nextProps.data.height;

export default React.memo(PeerRow, areEqual);
