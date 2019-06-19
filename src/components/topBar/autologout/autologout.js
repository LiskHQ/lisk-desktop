import React from 'react';
import Countdown from 'react-countdown-now';
import Renderer from './renderer';

const Autologout = ({
  account, onCountdownComplete, closeDialog,
  history, resetTimer, setActiveDialog, t,
}) => (
  <Countdown
    date={account.expireTime}
    onComplete={onCountdownComplete}
    renderer={({ minutes, seconds }) => (
      <Renderer
        minutes={minutes}
        seconds={seconds}
        closeDialog={closeDialog}
        history={history}
        resetTimer={resetTimer}
        setActiveDialog={setActiveDialog}
        t={t}
      />
    )}
  />
);


export default Autologout;
