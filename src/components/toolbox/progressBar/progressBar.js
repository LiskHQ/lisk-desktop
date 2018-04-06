import React from 'react';
import { themr } from 'react-css-themr';
import ToolBoxProgressBar from 'react-toolbox/lib/progress_bar';
import progressBarTheme from './progressBar.css';

const TBProgressBar = props => <ToolBoxProgressBar {...props} theme={props.theme}/>;

export default themr('progressBar', progressBarTheme)(TBProgressBar);
