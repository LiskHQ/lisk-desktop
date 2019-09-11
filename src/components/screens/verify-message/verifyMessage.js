import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from '../../multiStep';
import Result from './result';
import VerifyMessageInput from './verifyMessageInput';
import routes from '../../../constants/routes';

export default function VerifyMessage({
  t, history,
}) {
  function finalCallback() {
    history.push(routes.dashboard.path);
  }

  return (
    <section className={[grid.row, grid['center-xs']].join(' ')}>
      <MultiStep className={grid['col-sm-8']} finalCallback={finalCallback}>
        <VerifyMessageInput t={t} history={history} />
        <Result t={t} />
      </MultiStep>
    </section>
  );
}

VerifyMessage.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
