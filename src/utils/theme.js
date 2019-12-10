import React, { useContext } from 'react';
import ThemeContext from '../contexts/theme';

export const useTheme = () => useContext(ThemeContext);

export default function (WrappedComponent) {
  return function (props) {
    const theme = useTheme();
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
