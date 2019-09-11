import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MultiStep from '../../multiStep';
import VerifyMessageInput from './verifyMessageInput';
import Result from './result';

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
