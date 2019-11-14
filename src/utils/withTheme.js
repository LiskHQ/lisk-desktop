import React, { useContext } from 'react';
import ThemeContext from '../contexts/theme';

export default function (WrappedComponent) {
  return function (props) {
    const theme = useContext(ThemeContext);
    return (
      <div data-theme={theme}>
        <WrappedComponent
          {...props}
          theme={theme}
        />
      </div>
    );
  };
}
