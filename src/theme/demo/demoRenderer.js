import PropTypes from 'prop-types';
import React from 'react';
import jsxToString from 'jsx-to-string';

export const DarkWrapper = ({ children, display }) => (
  <span
    style={{
      display,
      background: '#0c152e',
      padding: 20,
    }}
  >
    {children}
  </span>
);

DarkWrapper.propTypes = {
  display: PropTypes.oneOf(['block', 'inline-block']),
};

DarkWrapper.defaultProps = {
  display: 'inline-block',
};

const DemoRenderer = ({ children, ...rest }) => (
  <div {...rest}>
    <pre>{children.map ? children.map(jsxToString).join('\n') : jsxToString(children)} </pre>
    {children}
  </div>
);

export default DemoRenderer;
