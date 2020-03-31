import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import routes from '../../../../../constants/routes';

const VoteRow = ({
  data, className,
}) => (
  <Link
    className={`${grid.row} ${className} vote-row`}
    to={`${routes.transactions.path}/${data.id}`}
  >
    <span className={grid['col-md-1']}>
      no
    </span>
    <span className={grid['col-md-2']}>
      ba ah
    </span>
  </Link>
);

export default React.memo(VoteRow);
