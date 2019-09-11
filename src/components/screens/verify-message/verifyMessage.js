import PropTypes from 'prop-types';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from '../../multiStep';
import Result from './result';
import VerifyMessageInput from './verifyMessageInput';

export default function VerifyMessage({
  t, history,
}) {
  return (
    <section className={[grid.row, grid['center-xs']].join(' ')}>
      <MultiStep className={grid['col-sm-8']}>
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
