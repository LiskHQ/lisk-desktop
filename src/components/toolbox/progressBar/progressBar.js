import React from 'react';
import ToolBoxProgressBar from 'react-toolbox/lib/progress_bar';
import progressBarTheme from './progressBar.css';
import withTheme from '../../../utils/withTheme';

const ProgressBar = props => <ToolBoxProgressBar {...props} theme={props.theme} />;

export default withTheme('ProgressBar', progressBarTheme)(ProgressBar);
