import React from 'react';

const withTheme = (name, theme) => (Component) => {
  const newComponent = props => <Component theme={theme} {...props} />;
  // newComponent.displayName = name;
  return newComponent;
};

export default withTheme;
