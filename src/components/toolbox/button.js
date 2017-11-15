import React from 'react';
import { Button as ToolBoxButton, IconButton as ToolBoxIconButton } from 'react-toolbox/lib/button';

const Button = props => <ToolBoxButton {...props} />;

const IconButton = props => <ToolBoxIconButton {...props} />;

export default Button;
export { Button, IconButton };
