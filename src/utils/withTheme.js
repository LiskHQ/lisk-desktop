import React from 'react';
import ThemeContext from '../contexts/theme';

export default (WrappedComponent, noWrapper) => {
  const WithTheme = props => (
    <ThemeContext.Consumer>
      {
        theme => (
          !noWrapper ? (
            <div data-theme={theme}>
              <WrappedComponent
                {...props}
                theme={theme}
              />
            </div>
          ) : (
            <WrappedComponent
              {...props}
              theme={theme}
              data-theme={theme}
            />
          )
        )
    }
    </ThemeContext.Consumer>
  );
  return WithTheme;
};
