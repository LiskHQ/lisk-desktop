import React from 'react';

const Renderer = ({ minutes, seconds }) => {
  const min = minutes < 10 ? `0${minutes}` : minutes;
  const sec = seconds < 10 ? `0${seconds}` : seconds;
  return <span>{min}:{sec}</span>;
};

export default Renderer;
